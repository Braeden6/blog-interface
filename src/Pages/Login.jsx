import { TextField, Button, Grid, FormLabel } from "@mui/material";
import { useState } from "react";
import { sha256 } from "js-sha256";






const Login = () => {
  const [serverSalt, setServerSalt] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(null);

  useState(() => {
    fetch("http://localhost:8000/login", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setServerSalt(data));
  }, []);

  const loginHandler = () => {
    if (!username || !password) return;
    const params = {
      username: username,
      password:  sha256(serverSalt.salt + sha256(password) + "1234"),
      clientSalt: "1234",
    };
    fetch(
      "http://localhost:8000/login?" + new URLSearchParams(params).toString(),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
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
        </>
      )}
    </>
  );
};

export default Login;
