import { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const ViewPost = () => {
  const { slug } = useParams();
  const [cookie, setCookie] = useCookies(["token"]);
  const [postContent, setPostContent] = useState(null);

  if (cookie.token == null) return <h1>Please Login</h1>;
  console.log(slug);

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

  const displayPostContent = () => {
    console.log(postContent)
    if (typeof postContent === "string") return <h1>{postContent}</h1>;
    else
      return (
        <div>
          <h1>{postContent.title}</h1>
          <p>{postContent.description}</p>
          <p>Created: {postContent.created}</p>
          {postContent.updated && <p>Updated: {postContent.updated}</p>}
            <p>Author: {postContent.author.first_name} {postContent.author.last_name}</p>
            <p>Tags: {postContent.tags.map((tag) => tag.name + " ")}</p>
            <p>{postContent.post_content.map((content, idx) => {
                if (content.type === "text") return <p key={idx}>{content.text}</p>;
                else if (content.type === "image") return <img key={idx} src={content.url} alt="post content" />;
            })}</p>
        </div>
      );
  };

  // display author title description tags content created
  return (
    <>{postContent === null ? <h1>Loading...</h1> : displayPostContent()}</>
  );
};

export default ViewPost;
