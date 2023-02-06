import Login from './Pages/Login'
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Registration from './Pages/Registration';
import NewPost from './Pages/NewPost';
import ViewPost from './Pages/ViewPost';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home  />} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/newPost" element={<NewPost/>} />
        <Route path="/viewPost/:slug" element={<ViewPost/>} />
      </Routes>
  )
}

export default App
