import React, { useEffect } from "react";
import ImageComponent from "../component/ImageComponent";
import carImg from "../assets/img/car.png";
import { useNavigate } from "react-router-dom";
import { BG_ORANGE } from "../utility/Utils";

const Splas = () => {
  const navigate = useNavigate(); // Initialize navigation
  useEffect(() => {
    // Apply background color when component mounts
    document.body.style.backgroundColor = BG_ORANGE;

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect to Login Page
    }, 3000);

  }, [navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container text-center">
        <ImageComponent src={carImg} alt="Helping Hands" width="30%" />
        <h1 className="text-white">Helping Hands</h1>
      </div>
    </div>  
  );
};

export default Splas;
