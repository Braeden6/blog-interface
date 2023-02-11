import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(null);
  const [cookies, setCookie] = useCookies(["token"]);
  const [response, setResponse] = useState(null);

  const loginHandler = () => {
    if (!username || !password) {
      setResponse("Please fill all the fields");
      return;
    }

    const body = {
      username: username,
      password: password,
    };
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("detail")) {
          setResponse(data.detail);
        } else {
          setCookie("token", data.token, { path: "/" });
          setCookie("user_id", data.id, { path: "/" });
          navigate("/home", { state: data });
        }
      });
  };

  return (
    <>
      <>
        {response && <p>{response}</p>}
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={loginHandler}>
          Submit
        </Button>
        <Link to="/registration">Click here to create account</Link>
      </>
    </>
  );
};

export default Login;
