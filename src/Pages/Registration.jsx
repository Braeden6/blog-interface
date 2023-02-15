import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { sha256 } from "js-sha256";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [middleName, setMiddleName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const loginHandler = () => {
    if (!username || !password || !firstName || !lastName || !phoneNumber)
      return;
    const body = {
      email: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      phone_number: phoneNumber,
    };
    fetch("http://localhost:8000/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((data) => {
        if (data !== null) navigate("/home", { state: data });
      });
  };

  return (
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
      <TextField
        id="outlined-basic"
        label="First Name"
        variant="outlined"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Last Name"
        variant="outlined"
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Middle Name"
        variant="outlined"
        onChange={(e) => setMiddleName(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Phone Number"
        variant="outlined"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button variant="contained" onClick={loginHandler}>
        Submit
      </Button>
    </>
  );
};

export default Registration;
