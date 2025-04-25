// src/App.jsx
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rides from "./pages/Rides";
import Ridesdetail from "./pages/Ridesdetail";
import CreateRide from "./pages/CreateRide";
import FileUpload from "./pages/FileUpload";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Rides" element={<Rides />} />
      <Route path="/ride/:id" element={<Ridesdetail />} /> {/* Updated Route */}
      <Route path="/CreateRide" element={<CreateRide />} />
      <Route path="/FileUpload" element={<FileUpload />} />

    </Routes>
  );
};

export default App;
