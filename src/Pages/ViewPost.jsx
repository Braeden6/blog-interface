import { Button, Collapse, Divider, List, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownOffAltTwoTone";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import Comment from "./Comment";

// if i am author show edit and delete button
// add callbacks to upvote and downvote
// if i am author of comment show edit and delete button
// add ability to comment
const ViewPost = () => {
  const { slug } = useParams();
  const [cookie, setCookie] = useCookies(["token", "user_id"]);
  const [postContent, setPostContent] = useState(null);
  const [enabledReply, setEnabledReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  console.log(cookie.token);

  if (cookie.token == null) return <h1>Please Login</h1>;

  const postVoteHandler = (isUpVote, isUndo) => {
    const params = {
      token: cookie.token,
    };
    const voteType = isUpVote ? "/upvote" : "/downvote";
    const undo = isUndo ? "/undo?" : "?";
    fetch(
      "http://localhost:8000/post/" +
        postContent.id +
        voteType +
        undo +
        new URLSearchParams(params).toString(),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let newPostContent = { ...postContent };
        newPostContent.votes = data;
        setPostContent(newPostContent);
      });
  };

  const postCommentHandler = () => {
    const params = {
      token: cookie.token,
      comment: replyContent
    }
    fetch("http://localhost:8000/post/" + postContent.id + "/comment?" + new URLSearchParams(params).toString(), {
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {

      let newPostContent = {...postContent};
      newPostContent.comments.push(data);
      console.log(newPostContent)
      setPostContent(newPostContent);
      setReplyContent("");
      setEnabledReply(false);
    }
    )
  };



  // count upvotes in post
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
          {voted === 1 ? <ThumbUpRoundedIcon /> : <ThumbUpTwoToneIcon />}
        </Button>
        <h3>{count}</h3>
        <Button onClick={() => voteHandler(false, voted === -1)}>
          {voted === -1 ? <ThumbDownRoundedIcon /> : <ThumbDownTwoToneIcon />}
        </Button>
      </Stack>
    );
  };

  // fetch post data from slug
  useState(() => {
    const params = {
      token: cookie.token,
    };
    fetch(
      "http://localhost:8000/post/" +
        slug +
        "?" +
        new URLSearchParams(params).toString(),
      {
        method: "GET",
      }
    )
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((data) => {
        if (data === null) return setPostContent("Post Not Found");
        setPostContent(data);
      });
  }, []);


  const updateComment = (comment, idx) => {
    let newPostContent = { ...postContent };
    newPostContent.comments[idx] = comment;
    setPostContent(newPostContent);
  };

  const deleteComment = (idx) => {
    let newPostContent = { ...postContent };
    newPostContent.comments.splice(idx, 1);
    setPostContent(newPostContent);
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
              <Button onClick={() => setEnabledReply(!enabledReply)}>Reply</Button>
            {postContent.author.id == cookie.user_id && (
              <>
                <Button>Edit Post</Button>
                <Button onClick={() => console.log("dlete")}>
                  Delete Post
                </Button>
              </>
            )}
            </div>
            {getVotes(postContent.votes, postVoteHandler)}
          </div>
          <Divider />
          {enabledReply && <div><TextField
          fullWidth
          id="outlined-basic"
          label="Comment"
          variant="outlined"
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <Button onClick={postCommentHandler}>Submit</Button>
        </div>}
          {postContent.comments.map((comment, idx) => {
            return (
              <Comment comment={comment} idx= {idx} updateComment={(newComment) => updateComment(newComment,idx)} deleteComment={() => deleteComment(idx)} />
            );
          })}
        </>
      );
  };

  // display author title description tags content created
  return (
    <>{postContent === null ? <h1>Loading...</h1> : displayPostContent()}</>
  );
};

export default ViewPost;
