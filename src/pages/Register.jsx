import React, { useState, useEffect } from "react";
import { Container, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { BG_WHITE, API_URL } from "../utility/Utils";
import carImg from "../assets/img/car.png";
import ImageComponent from "../component/ImageComponent";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = BG_WHITE;
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setToastMessage("Passwords do not match.");
      setShowToast(true);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData; // Exclude confirmPassword
      const response = await axios.post(`${API_URL}register`, submitData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        setToastMessage("Registration successful! Redirecting to login...");
        setShowToast(true);
  
        // Wait 2 seconds, then navigate
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setToastMessage("Registration failed. Try again.");
        setShowToast(true);
      }
       
    } catch (error) {
      setToastMessage("Something went wrong. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <ImageComponent src={carImg} alt="Helping Hands" width="30%" className="text-warning mb-2" />
      <h3 className="text-warning mb-4">Help to Ride</h3>

      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-warning">Register</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="border-warning"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border-warning"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border-warning"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className="border-warning"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              isInvalid={
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
              }
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              className="border-warning"
              value={formData.phone}
              onChange={(e) => {
                const input = e.target.value;
                const isValid = /^\+?[0-9]*$/.test(input);
                const digitsOnly = input.replace(/\D/g, "");
                const maxLength = input.startsWith("+") ? 10 : 10;

                if (isValid && digitsOnly.length <= maxLength) {
                  setFormData({ ...formData, phone: input });
                }
              }}
              inputMode="tel"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 text-start">
            <Form.Label className="text-warning">Role</Form.Label>
            <Form.Select
              name="role"
              className="border-warning"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="rider">Rider</option>
            </Form.Select>
          </Form.Group>

          <p className="text-warning">
            Already have an account?{" "}
            <Link to="/login" className="fw-bold text-warning">
              Login
            </Link>
          </p>

          <Button
            type="submit"
            variant="warning"
            className="w-100 py-2 fw-bold text-white"
            disabled={formData.password !== formData.confirmPassword}
          >
            Register
          </Button>
        </Form>
      </div>

      <p className="text-warning mt-5">Version 1.0</p>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Registration Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Register;
