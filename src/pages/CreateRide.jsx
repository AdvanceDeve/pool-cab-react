import { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { API_URL,checkSessionToken } from "../utility/Utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const CreateRide = () => {
  useEffect(() => {
    checkSessionToken();
  }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: "",
    drop_point: "",
    departure_date: "",
    start_time: "",
    is_free: "paid",
    price: "",
    seat: 1,
    vehicle_type: "car",
    vehicle_number: "",
    note: "",
  });
   
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.pickup) newErrors.pickup = "Pickup location is required";
    if (!formData.drop_point) newErrors.drop_point = "Drop point is required";
    if (!formData.departure_date) newErrors.departure_date = "Date is required";
    if (!formData.start_time) newErrors.start_time = "Time is required";
    if (formData.is_free === "paid" && !formData.price)
      newErrors.price = "Price is required for paid rides";
    if (!formData.vehicle_number) newErrors.vehicle_number = "Vehicle number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const rideData = {
      pickup: formData.pickup,
      drop_point: formData.drop_point,
      departure_date: formData.departure_date,
      start_time: formData.start_time,
      is_free: formData.is_free,
      price: formData.is_free === "free" ? null : formData.price, // Set price to null if free
      seat: formData.seat,
      vehicle_type: formData.vehicle_type,
      vehicle_number: formData.vehicle_number,
      note: formData.note,
    };
    try {
      const response = await axios.post(
        `${API_URL}createRide`,
        rideData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Ride created successfully!");
      setTimeout(() => navigate("/rides"), 1500);
    } catch (error) {
      setMessage("Error creating ride. Try again.");
    }
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    });
  };
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
      setFormData({ ...formData, departure_date: formattedDate });
    } else {
      setFormData({ ...formData, departure_date: '' });
    }
  };


  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/rides" className="btn btn-secondary">
          ← 
        </Link>
        <h2>Create a Ride</h2>
      </div>

      {message && <Alert variant={message.includes("Error") ? "danger" : "success"}>{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Pickup Location</Form.Label>
          <Form.Control
            type="text"
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            isInvalid={!!errors.pickup}
          />
          <Form.Control.Feedback type="invalid">{errors.pickup}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Drop Point</Form.Label>
          <Form.Control
            type="text"
            name="drop_point"
            value={formData.drop_point}
            onChange={handleChange}
            isInvalid={!!errors.drop_point}
          />
          <Form.Control.Feedback type="invalid">{errors.drop_point}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Departure Date</Form.Label>
          <Form.Control
            type="date"
            name="departure_date"
            value={formData.departure_date}
            onChange={handleChange}
            isInvalid={!!errors.departure_date}
          />
          <Form.Control.Feedback type="invalid">{errors.departure_date}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Select
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            {Array.from({ length: 24 }, (_, hour) =>
              ["00", "15", "30", "45"].map((minute) => (
                <option key={`${hour}:${minute}`} value={`${hour.toString().padStart(2, "0")}:${minute}`}>
                  {hour.toString().padStart(2, "0")}:{minute}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Is Free?</Form.Label>
          <Form.Select name="is_free" value={formData.is_free} onChange={handleChange}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Form.Select>
        </Form.Group>

        {formData.is_free === "paid" && (
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              disabled={formData.is_free === "free"} // Disable if ride is free
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Seats</Form.Label>
          <Form.Control
            type="number"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            min="1"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vehicle Type</Form.Label>
          <Form.Select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange}>
            <option value="car">Car</option>
            <option value="scooty">Scooty</option>
            <option value="bike">Bike</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vehicle Number</Form.Label>
          <Form.Control
            type="text"
            name="vehicle_number"
            value={formData.vehicle_number}
            onChange={handleChange}
            isInvalid={!!errors.vehicle_number}
          />
          <Form.Control.Feedback type="invalid">{errors.vehicle_number}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Create Ride
        </Button>
      </Form>
    </Container>
  );
};

export default CreateRide;
