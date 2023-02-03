import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  if (location.state == null) return <h1>Please Login</h1>;

  console.log(location);
  return (
    <div>
      <h1>Hello {location.state.first_name} {location.state.last_name}</h1>
      <h2>Your email is: {location.state.email}</h2>
      <h2>You are: {location.state.role}</h2>
    </div>
  );
};

export default Home;
