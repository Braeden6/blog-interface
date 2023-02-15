import Login from './Pages/Login'
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Registration from './Pages/Registration';
import NewPost from './Pages/NewPost';
import ViewPost from './Pages/ViewPost';
import Admin from './Pages/Admin';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home  />} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/newPost" element={<NewPost/>} />
        <Route path="/viewPost/:slug" element={<ViewPost/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
  )
}

export default App
