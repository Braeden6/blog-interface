import Login from './Pages/Login'
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Registration from './Pages/Registration';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
  )
}

export default App
