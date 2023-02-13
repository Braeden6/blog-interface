import {
  Button,
  Collapse,
  Divider,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownOffAltTwoTone";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import Comments from "./Components/Comments";
import Votes from "./Components/Votes";

// if i am author show edit and delete button
// add callbacks to upvote and downvote
// if i am author of comment show edit and delete button
// add ability to comment
const ViewPost = () => {
  const { slug } = useParams();
  const [cookie, setCookie] = useCookies(["token", "user_id"]);
  const [postContent, setPostContent] = useState(null);
  const [enableComment, setEnableComment] = useState(false);
  const [enableAnswer, setEnableAnswer] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  console.log(cookie.token);

  if (cookie.token == null) return <h1>Please Login</h1>;

  // fetch post data from slug
  useState(() => {
    const params = {
      token: cookie.token,
    };
    fetch(
      "http://localhost:8000/blog/post/" +
        slug +
        "?" +
        new URLSearchParams(params).toString(),
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("detail")) return setPostContent(data.detail);
        setPostContent(data);
      });
  }, []);

  const replyHandler = () => {
    // blog/post/{post_id}/comment/create
    // blog/post/{post_id}/answer/create
    const params = {
      token: cookie.token,
      comment: replyContent,
    };
    fetch( "http://localhost:8000/blog/post/" + postContent.id + "/comment/create?" + new URLSearchParams(params).toString(), {
      method: "POST",
  })
  .then(res => console.log(res.status))


    setReplyContent("");
    setEnableAnswer(false);
    setEnableComment(false);
  };

  const displayPostContent = () => {
    console.log(postContent);
    if (typeof postContent === "string") return <h1>{postContent}</h1>;
    else
      return (
        <>
          <div>
            <h1>{postContent.title}</h1>
            <p>{postContent.description}</p>
            <p>Created: {postContent.created}</p>
            {postContent.updated && <p>Updated: {postContent.updated}</p>}
            <p>
              Author: {postContent.author.first_name}{" "}
              {postContent.author.last_name}
            </p>
            <p>Tags: {postContent.tags.map((tag) => tag.name + " ")}</p>
            <h2>
              {postContent.post_content.map((content, idx) => {
                if (content.type === "text")
                  return <p key={idx}>{content.text}</p>;
                else if (content.type === "image")
                  return <img key={idx} src={content.url} alt="post content" />;
              })}
            </h2>
            <div>
              <Button onClick={() => setEnableComment(!enableComment)} disabled={enableAnswer}>
                Comment
              </Button>
              <Button onClick={() => setEnableAnswer(!enableAnswer)} disabled={enableComment}>
                Answer
              </Button>
              {postContent.author.id == cookie.user_id && (
                <>
                  <Button>Edit Post</Button>
                  <Button onClick={() => console.log("dlete")}>
                    Delete Post
                  </Button>
                </>
              )}
            </div>
            {(enableComment || enableAnswer) && (
              <div>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label={enableComment ? "Comment" : "Answer"}
                  variant="outlined"
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button onClick={replyHandler}>Submit</Button>
              </div>
            )}
            <Votes
              id={postContent.id}
              url={"http://localhost:8000/blog/post/"}
            />
          </div>
          <Divider />
          <Comments
            url={"http://localhost:8000/blog/post/"}
            id={postContent.id}
            isAnswer={false}
          />
          <Divider />
          <Comments
            url={"http://localhost:8000/blog/post/"}
            id={postContent.id}
            isAnswer={true}
          />
        </>
      );
  };

  // display author title description tags content created
  return <>{!postContent ? <h1>Loading...</h1> : displayPostContent()}</>;
};

export default ViewPost;
