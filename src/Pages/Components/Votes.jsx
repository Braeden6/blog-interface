import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownOffAltTwoTone";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { useCookies } from "react-cookie";

const Votes = (props) => {
    const id = props.id;
    const url = props.url;
    const [votes, setVotes] = useState(null);
    const [count, setCount] = useState(0);
    const [cookie, setCookie] = useCookies(["token", "user_id"]);
    const [voted, setVoted] = useState(false);

    const getVotes = () => {
        const params = {
            token: cookie.token,
        };
        fetch(url + id + "/votes?" + new URLSearchParams(params).toString(), {
            method: "GET",
        })
        .then(res => res.json())
        .then(data => setVotes(data))
    }

    useEffect(() => {
        getVotes()
    }, [])

    useEffect(() => {
        let count = 0;
        setVoted(false);
        for (let vote in votes) {
            count += votes[vote].vote ? 1 : -1;
            if (votes[vote].user_id == cookie.user_id) {
                setVoted(votes[vote].vote ? 1 : -1);
            }
        }
        setCount(count);
    }, [votes])

    const voteHandler = (isUpVote, isUndo) => {
        const params = {
            token: cookie.token,
        };
        const voteType = isUpVote ? "/upvote" : "/downvote";
        const undo = isUndo ? "/undo?" : "?";
        fetch(
            url +
            id +
            voteType +
            undo +
            new URLSearchParams(params).toString(),
            {
                method: isUndo? "DELETE" : "POST",
            }
        )
        .then(res => res.status == 200 ? getVotes() : null)
    }

    return (
        <Stack direction="row">
        <Button onClick={() => voteHandler(true, voted == 1)}>
          {voted == 1 ? <ThumbUpRoundedIcon /> : <ThumbUpTwoToneIcon />}
        </Button>
        <h3>{count}</h3>
        <Button onClick={() => voteHandler(false, voted == -1)}>
          {voted == -1 ? <ThumbDownRoundedIcon /> : <ThumbDownTwoToneIcon />}
        </Button>
      </Stack>
    );
}

export default Votes;