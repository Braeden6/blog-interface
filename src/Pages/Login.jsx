import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { sha256 } from "js-sha256";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";






const Login = () => {
  const navigate = useNavigate();
  const [serverSalt, setServerSalt] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(null);
  const [cookies, setCookie] = useCookies(['token']);

  useState(() => {
    fetch("http://localhost:8000/login", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setServerSalt(data));
  }, []);

  const loginHandler = () => {
    if (!username || !password) return;

    const clientSalt = (Math.random() + 1).toString(36).substring(8);
    const params = {
      clientSalt: clientSalt,
    };
    const body = {
      username: username,
      password:  sha256(serverSalt.salt + sha256(password) + clientSalt),
    };
    fetch(
      "http://localhost:8000/login?" + new URLSearchParams(params).toString(),
      {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body),
      }
    )
      .then((res) =>  res.status === 200 ? res.json(): null)
      .then((data) => {if (data !== null) {
        setCookie('token', data.token, { path: '/' });
        navigate("/home", { state: data })
  }});
  };

  return (
    <>
      {!serverSalt && <h1>Loading....</h1>}
      {serverSalt && (
        <>
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={loginHandler}>
            Submit
          </Button>
          <Link to="/registration">Click here to create account</Link>
        </>
      )}
    </>
  );
};

export default Login;
