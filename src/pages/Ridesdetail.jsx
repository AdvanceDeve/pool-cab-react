import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { API_URL, BG_WHITE, checkSessionToken } from "../utility/Utils";

const Ridesdetail = () => {
  const { id } = useParams(); // Get ride ID from URL
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookingList] = useState(null);
  let token = sessionStorage.getItem("token");

  document.body.style.backgroundColor = BG_WHITE;
  useEffect(() => {
    checkSessionToken();
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        const getRideWithBookings = await axios.get(`${API_URL}getRideWithBookings/${atob(id)}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setBookingList(getRideWithBookings.data); // Store ride details

        const response = await axios.get(`${API_URL}getRideById/${atob(id)}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setRide(response.data.ride); // Store ride details
      } catch (error) {
        console.error("Error fetching ride details:", error.response?.data || error.message);
        setError("Failed to load ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);


  const toggleApproval = async (id,status) =>{
    try{
      let token = sessionStorage.getItem("token");
      const url = `${API_URL}approveBooking`;

      const data = {
        "id":id,
        "status":status //"approved" //reject
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
      const response = await axios.post(url, data, config);

      const updatedBooking = response.data.booking;

    // Only update if bookings is not null
    if (bookings) {
      setBookingList(prev =>
        prev.map(item =>
          item.booking_id === updatedBooking.id
            ? { ...item, is_approved: updatedBooking.is_approved }
            : item
        )
      );
    }

    // Toast
    if (updatedBooking.is_approved === 'Approved') {
      toast.success('Booking approved successfully!');
    } else if (updatedBooking.is_approved === 'reject') {
      toast.error('Booking rejected successfully!');
    } else {
      toast.info('ℹ️ Booking updated.');
    }
    }catch(error){
      console.log(error.message);
    }
  }

  

  return (
    <div className="container  mt-2">
      <Link to="/rides" className="btn btn-secondary">
        ← 
      </Link>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : ride ? (
        <div className="card  mt-4">
          <div className="card-header bg-primary text-white">
            Ride Details - {ride.pickup} → {ride.drop_point}
          </div>
          <div className="card-body">
            <p><strong>Date:</strong> {ride.departure_date} | <strong>Time:</strong> {ride.start_time}</p>
            <p><strong>Vehicle:</strong> {ride.vehicle_type} ({ride.vehicle_number}) | <strong>Seats:</strong> {ride.seat}</p>
            <p><strong>Price:</strong> ₹{ride.price} ({ride.is_free}) | <strong>Status:</strong> {ride.status}</p>
          </div>
        </div>
      ) : (
        <p className="alert alert-warning">Ride not found.</p>
      )}


      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : bookings.length > 0 ? (
            <div className="mt-2 card" style={{border: "0px"}}>
              <div className="card-header bg-primary text-white">
                Passanger Request Details
              </div>
              <ul className="list-group">
                {bookings.map((item, index) => (
                  <li key={index} className="list-group-item">                    
                    <strong>Passenger:</strong> {item.name}  | <strong>Status:</strong> {item.booking_status}<br />
                    <strong>Email:</strong> {item.email} <br />
                    <strong>Phone:</strong> {item.phone || "N/A"} <br /> 
                    <p className = "text-capitalize"><strong>Approval:</strong> {item.is_approved} | <a className="btn btn-sm btn-outline-primary" onClick={() => toggleApproval(item.booking_id,'approved')} >Approve</a> | <a className="btn btn-sm btn-outline-danger" onClick={() => toggleApproval(item.booking_id,'reject')}>Reject</a></p> 
                  </li>
                ))}
              </ul>
            </div>
      ) : (
        <p className="alert alert-warning">Ride not found.</p>
      )}
    </div>
  );
};

export default Ridesdetail;
