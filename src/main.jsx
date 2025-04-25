// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./assets/BottomNav.css";
import Bootombar from "./component/Bootombar.jsx";
import SessionTimeout from "./pages/SessionTimeout.jsx"

// const hideNavRoutes = ['/login', '/signup']; // Add more if needed
// const showBottomNav = !hideNavRoutes.includes(location.pathname);


document.getElementById("root").style.width = "100%";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <SessionTimeout timeout={24 * 60 * 60 * 1000} />

      <App />
      <Bootombar />
      {/* {showBottomNav && <Bootombar />} */}
    </BrowserRouter>
  </React.StrictMode>
);