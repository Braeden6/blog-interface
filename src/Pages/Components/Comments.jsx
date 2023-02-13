import {
  Button,
  Card,
  Collapse,
  Stack,
  List,
  CardContent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Votes from "./Votes";

const Comments = (props) => {
  const url = props.url;
  const id = props.id;
  const isAnswer = props.isAnswer;
  const [open, setOpen] = useState(false);
  const [cookie, setCookie] = useCookies(["token", "user_id"]);
  const [comments, setComments] = useState([]);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const params = {
      token: cookie.token,
    };
    const type = isAnswer? "/answers?" : "/comments?";
    fetch(url + id + type + new URLSearchParams(params).toString(), {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      });
  }, []);

  return (
    <>
      <Button onClick={handleClick}>
        {isAnswer? "Answers " : "Comments "} {open ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Collapse in={open} unmountOnExit>
        {comments.map((comment) => {
          return (
            <Card fullWidth>
              <CardContent>
                <Typography variant="h5" component="div">
                  {comment.comment}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Author: {comment.author.first_name} {comment.author.last_name}
                </Typography>
                <Typography variant="body2">{comment.created}</Typography>
              </CardContent>
              <Votes
                url={isAnswer? "http://localhost:8000/blog/answer/" :"http://localhost:8000/blog/comment/" }
                id={comment.id}
              />
              <div>
                {isAnswer && <Button>Reply</Button>}
                {comment.author.id == cookie.user_id && (
                  <>
                    <Button>Edit Comment</Button>
                    <Button onClick={() => deleteCommentHandler(comment.id)}>
                      Delete Comment
                    </Button>
                  </>
                )}
              </div>
              { isAnswer && <Comments url={"http://localhost:8000/blog/answer/"} id={comment.id} isAnswer={false} />}
            </Card>
          );
        })}
      </Collapse>
    </>
  );
};

export default Comments;
