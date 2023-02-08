import { Button, Card, Collapse, Stack, List } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownOffAltTwoTone";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const Comment = (props) => {
  const comment = props.comment;
  const updateComment = props.updateComment;
  const [open, setOpen] = useState(false);
  const [cookie, setCookie] = useCookies(["token", "user_id"]);

  if (props.comment == null) return;

  const handleClick = () => {
    setOpen(!open);
  };

  const getVotes = (votes, voteHandler) => {
    let count = 0;
    let voted = 0;
    for (let vote in votes) {
      if (votes[vote].user_id == cookie.user_id)
        voted = votes[vote].vote ? 1 : -1;
      count += votes[vote].vote ? 1 : -1;
    }

    return (
      <Stack direction="row">
        <Button onClick={() => voteHandler(true, voted === 1)}>
          {" "}
          {voted === 1 ? <ThumbUpRoundedIcon /> : <ThumbUpTwoToneIcon />}
        </Button>
        <h3>{count}</h3>
        <Button onClick={() => voteHandler(false, voted === -1)}>
          {voted === -1 ? <ThumbDownRoundedIcon /> : <ThumbDownTwoToneIcon />}
        </Button>
      </Stack>
    );
  };

  const commentVoteHandler = (commentID, isUpVote, isUndo) => {
    const params = {
      token: cookie.token,
    };
    const voteType = isUpVote ? "/upvote" : "/downvote";
    const undo = isUndo ? "/undo?" : "?";
    fetch(
      "http://localhost:8000/post/comment/" +
        commentID +
        voteType +
        undo +
        new URLSearchParams(params).toString(),
      {
        method: "POST",
      }
    )
      .then((res) => res.status === 200 ? res.json():null)
      .then((data) => {
        if (data) {
          let newComment = { ...comment };
          newComment.votes = data;
          updateComment(newComment);
        }
      });
  };

  const updateSubComment = (subComment, idx) => {
    let newComment = { ...comment };
    newComment.sub_comments[idx] = subComment;
    updateComment(newComment);
  };


  const deleteCommentHandler = (commentID) => {
    const params = {
      token: cookie.token,
    };
    fetch(
      "http://localhost:8000/post/comment/" +
        commentID +
        "/delete?" +
        new URLSearchParams(params).toString(),
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.status === 200) {
      }
    });
  };

  return (
    <Stack direction="row">
      <div style={{ marginLeft: 20 }}></div>
      <Card>
        <div >
          <p>
            Author: {comment.author.first_name} {comment.author.last_name}
          </p>
          <p>Created: {comment.created}</p>
          {comment.updated && <p>Updated: {comment.updated}</p>}
          {getVotes(comment.votes, (isUpVote, isUndo) =>
            commentVoteHandler(comment.id, isUpVote, isUndo)
          )}
          <h2>{comment.comment}</h2>
          <div>
            <Button>Reply</Button>
            {comment.author.id == cookie.user_id && (
              <>
                <Button>Edit Comment</Button>
                <Button onClick={() => deleteCommentHandler(comment.id)}>
                  Delete Comment
                </Button>
              </>
            )}
          </div>
          <Button onClick={handleClick}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Collapse in={open} unmountOnExit>
            {comment.sub_comments !== undefined && 
            <List>
              {comment.sub_comments.map((sub_comment, idx) => (
                <Comment
                  comment={sub_comment}
                  updateComment={(sub_comment) => updateSubComment(sub_comment, idx)}
                />
              ))}
            </List>}
          </Collapse>
        </div>
      </Card>
    </Stack>
  );
};

export default Comment;
