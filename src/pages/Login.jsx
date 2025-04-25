import React, { useState } from "react";
import { Container, Form, Button,  Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react"; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { BG_WHITE,API_URL } from "../utility/Utils";
import carImg from "../assets/img/car.png";
import ImageComponent from "../component/ImageComponent";
import { parse } from "postcss";

const Login = () => {
  const navigate = useNavigate(); // Define useNavigate() at the top

  useEffect(() => {
    document.body.style.backgroundColor = BG_WHITE;
  }, []);

  // State for form inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // State for toast message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Store token in session
  const setSession = (token) => {
    const now = new Date();
    const expiry = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("expiry", expiry);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data for API
      const loginData = {
        email: formData.username,
        password: formData.password,
      };

      const response = await axios.post(`${API_URL}login`, loginData, {
        headers: { "Content-Type": "application/json" },
      });
      setShowToast(false); 
       
      if (response.status === 200 && response.data.token != '') {
        setSession(response.data.token);

        let profile = '';

        await axios.get(`${API_URL}users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.data.token}`
          },
        }).then(response => {
          profile = response.data.users; // Only extract users
          if(response.status === 200){ 
            var userDetail = profile[0];  
            sessionStorage.setItem("userDetail", JSON.stringify(userDetail));
          }
        }).catch(error => console.error(error));
        if(profile[0].role === 'user'){
          navigate("/Rides"); //Corrected useNavigate() usage

        }else{
          navigate("/Dashboard"); //Corrected useNavigate() usage
        }
      }else{
        setToastMessage("Invalid username or password"); // Set error message
        setShowToast(true); // Show toast
      }
    } catch (error) {
      setToastMessage("Login failed. Please try again."); // Set error message
      setShowToast(true); // Show toast
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      {/* Car Icon */}
      <ImageComponent src={carImg} alt="Helping Hands" width="30%" className="text-warning mb-2" />
      <h3 className="text-warning mb-4">Help to Ride</h3>


      {/* Login Form */}
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-warning">Login</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="User name...."
              className="border-warning"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password...."
              className="border-warning"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <p className="text-warning text-start">Forgot Password?</p>

          <p className="text-warning">
            Don’t have an account?{" "}
            <Link to="/register" className="fw-bold text-warning">
              Register
            </Link>
          </p>

          <Button type="submit" variant="warning" className="w-100 py-2 fw-bold text-white">
            Submit
          </Button>
        </Form>
      </div>

      {/* 🔹 Version Info */}
      <p className="text-warning mt-5">Version 1.0</p>
      {/* Bootstrap Toast for Login Failure */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Login Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Login;
 