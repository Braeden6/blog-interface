import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const Admin = () => {
  const [imageData, setImageData] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);


  useEffect(() => {
    const params = new URLSearchParams({
        token: cookie.token,
    });
    fetch("http://localhost:8000/blog/admin/chart?" + params.toString())
      .then(response => response.json())
      .then(data => setImageData(data.image));
  }, []);

  const imageUrl = `data:image/png;base64,${imageData}`;

  return (
    <div>
      <img src={imageUrl} alt="Image" />
    </div>
  );
}

export default Admin;