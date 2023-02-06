import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Home = (props) => {
  const location = useLocation();
  const [cookie, setCookie] = useCookies(["token"]);
  if (cookie.token == null) return <h1>Please Login</h1>;
  return (
    <div>
      <h1>Hello {location.state.first_name} {location.state.last_name}</h1>
      <h2>Your email is: {location.state.email}</h2>
      <h2>You are: {location.state.role}</h2>
      <Link to="/newPost" token={location.state.token}>New Post.</Link>
    </div>
  );
};

export default Home;
