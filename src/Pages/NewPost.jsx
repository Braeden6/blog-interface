import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  Button,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { useState } from "react";

const NewPost = () => {
  const [cookie, setCookie] = useCookies(["token"]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [postContent, setPostContent] = useState([]);
  const [tech, setTech] = useState([]);

  if (cookie.token == null) return <h1>Please Login</h1>;

  useState(() => {
    const params = {
      token: cookie.token,
    };
    fetch(
      "http://localhost:8000/post/create?" +
        new URLSearchParams(params).toString(),
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => setTech(data))
      .then(() => console.log(tech));
  }, []);

  const addTag = (e) => {
    if (tags.includes(e.target.value)) return;
    setTags([...tags, e.target.value]);
  };

  const submitHandler = () => {
    if (!title || tags.length === 0 || postContent.length === 0) return;
    const tag_ids = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tech.length; j++) {
        if (tech[j].name === tags[i]) {
          tag_ids.push(tech[j].id);
        }
      }
    }
    const body = {
      token: cookie.token,
      title: title,
      description: description,
      post_content: postContent,
      technology_ids: tag_ids,
    };
    fetch("http://localhost:8000/post/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json());
  };

  // title description post_content technologies_ids
  return (
    <>
      <div>
        <p>{title}</p>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Title"
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{description}</p>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Description"
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth>
          <FormLabel id="demo-simple-select-label">Tags</FormLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={0}
            label="Age"
            onChange={addTag}
          >
            {tech.map((e) => {
              return <MenuItem value={e.name}>{e.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        {tags.map((tag) => {
          return <p>{tag}</p>;
        })}
        <FormLabel id="demo-simple-select-label">Edit Post Content</FormLabel>
        {postContent.map((e, idx) => {
          const type = e["type"];
          if (type === "image") {
            return (
              <TextField
                fullWidth
                id="outlined-basic"
                label={"Image URL"}
                variant="outlined"
                value={e["url"]}
                onChange={(e) => {
                  let newArr = [...postContent];
                  newArr[idx] = { type: "image", url: e.target.value };
                  setPostContent(newArr);
                }}
              />
            );
          }
          if (type === "text") {
            return (
              <TextField
                fullWidth
                id="outlined-basic"
                label={"Text"}
                variant="outlined"
                value={e["text"]}
                onChange={(e) => {
                  let newArr = [...postContent];
                  newArr[idx] = { type: "text", text: e.target.value };
                  setPostContent(newArr);
                }}
              />
            );
          }
        })}
        <Button
          variant="contained"
          onClick={() => {
            let newArr = [...postContent];
            newArr.push({ type: "image", url: "" });
            setPostContent(newArr);
          }}
        >
          Add Image
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            let newArr = [...postContent];
            newArr.push({ type: "text", text: "" });
            setPostContent(newArr);
          }}
        >
          Add Text
        </Button>
      </div>
      <Button variant="contained" onClick={submitHandler}>
        Submit Post
      </Button>
    </>
  );
};

export default NewPost;
