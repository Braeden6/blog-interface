import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { sha256 } from "js-sha256";
import { useNavigate } from "react-router-dom";






const Login = () => {
    const navigate = useNavigate();
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
    const clientSalt = (Math.random() + 1).toString(36).substring(8);
    const params = {
      username: username,
      password:  sha256(serverSalt.salt + sha256(password) + clientSalt),
      clientSalt: clientSalt,
    };
    fetch(
      "http://localhost:8000/login?" + new URLSearchParams(params).toString(),
      {
        method: "POST",
      }
    )
      .then((res) =>  res.status === 200 ? res.json(): null)
      .then((data) => {if (data !== null) navigate("/home", { state: data })});
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
