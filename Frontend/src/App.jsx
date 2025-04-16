import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";
import Rooms from "./pages/Rooms.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./component/Navbar.jsx";
import About from "./pages/About.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./component/Footer.jsx";


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Rooms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat/:roomId" element={<Chat />} />
         <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;