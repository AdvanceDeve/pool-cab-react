import { Link,useNavigate } from "react-router-dom";
import { BG_WHITE, API_URL, checkSessionToken } from "../utility/Utils";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Toast, ToastContainer, Form } from "react-bootstrap";
import {rideStatus} from "../utility/Utils";

const Rides = () => {
  const navigate = useNavigate(); // Define useNavigate() at the top
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedStatus, setSelectedStatus] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tempStatus, setTempStatus] = useState('');
  const [rideId, setRideId] = useState('');

  const limit = 4;
  let token = sessionStorage.getItem("token");
  let userDetail = sessionStorage.getItem("userDetail");
  let _userDetail = JSON.parse(userDetail);
  const userRole = _userDetail.role;
  useEffect(() => {
    checkSessionToken();
    document.body.style.backgroundColor = BG_WHITE;
    document.body.style.marginBottom = '80px';
    fetchRides();
  }, [page,sortOrder,from, to]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      let params = {
        page: page,
        limit: limit,
        order: sortOrder.toUpperCase(),
      };

      if (from) params.pickup = from;
      if (to) params.drop_point = to;

      const response = await axios.get(`${API_URL}listRides`, {
        params: params,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      setRides(response.data?.rides || []);
      setTotalRecords(response.data?.total || 0);
    } catch (error) {
      console.error("Error fetching rides:", error.response?.data || error.message);
      setRides([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = (ride) => {
    setSelectedRide(ride);
    setShowModal(true);

  };

  const confirmBooking = async () => {
    if (!selectedRide) return;
    let _status = 'booked';
    let _is_approved = 'pending';
    let createBookingresponse = '';
    try {
      createBookingresponse = await axios.post(
        `${API_URL}createBooking`,
        {
          ride_id: selectedRide.id,
          user_id: _userDetail.id,
          status: _status,
          is_approved: _is_approved,
          created_by: _userDetail.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToastMessage(response.data.message || "Booking successful!");
      setToastVariant("success");
    } catch (error) { 
      console.error("Error booking ride:", error.response?.data || error.message);
      setToastMessage(error.response?.data?.message || error.message);
      setToastVariant("danger");
    } finally {
      setShowToast(true);
      setShowModal(false);
      setSelectedRide(null);
    }
  };

  const handleSearch = () => {
    setPage(1); // reset to page 1 on new search
    fetchRides();
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setPage(1);
    fetchRides();
  };

  const handleCreateRide = () => {
    navigate('/CreateRide')
  }
  
  const handleStatusChange = (rideId, event) => {
    const _status = event.target.value;

    if (_status === 'deleted') {
      setTempStatus(_status);
      setRideId(rideId)      // store temporarily
      setShowConfirmModal(true);     // show modal
    } else {
      updateStatus(rideId,_status)
      setSelectedStatus(_status);  // directly set status
    }
  };

  function updateStatus(id, status) {
    try {
      axios.put(
        `${API_URL}updateRide/${id}`,
        { status: status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      ).then(response => {
        if(response.status === 200){
          fetchRides();
        }
        // Optionally show a success message or update UI here
      }).catch(error => {
        console.error('Error updating ride status:', error.response.data?.ride || error.message);
        // Optionally show an error message to the user
      });
  
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  }
  

  const confirmDelete = () => {
    setSelectedStatus(tempStatus);
    setShowConfirmModal(false);
    updateStatus(rideId,tempStatus)
    // Trigger delete logic or API here
  };

  const cancelDelete = () => {
    setTempStatus('');
    setShowConfirmModal(false);
  };

  let _hide = '';
  if(userRole === 'user'){
    _hide = 'd-none';
  }
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">        
        <Link to="/Dashboard" className={`btn btn-secondary ${_hide}`}>
          ← 
        </Link>
        {userRole === 'rider' && (
        <Button variant="success" onClick={handleCreateRide}>
          + Add Ride
        </Button>
        )}
      </div>
      <h2 className="mb-3">Ride List</h2>

      <div className="row mb-3">
        <div className="col-md-4 mt-2">
          <Form.Control
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-2">
          <Form.Control
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-2">
          <Button variant="primary" className="me-2" onClick={handleSearch}>Search</Button>
          <Button variant="secondary" onClick={handleClear}>Clear</Button>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label me-2">Sort by Time:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
        >
          <option value="asc">Earliest First</option>
          <option value="desc">Latest First</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading rides...</span>
          </div>
        </div>
      ) : rides.length > 0 ? (
        <ul className="list-group">
          {rides.map((ride) => (
            <li key={ride.id} className="list-group-item list-iteam">
              <div className="carda">
                <div className="card-body">
                  <h5 className="card-title">{ride.pickup} → {ride.drop_point}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {ride.departure_date} | <strong>Time:</strong> {ride.start_time} | <strong>Seats:</strong> {ride.seat} <br />
                    <strong>Price:</strong> ₹{ride.price} ({ride.is_free}) | <strong>Vehicle:</strong> {ride.vehicle_type} ({ride.vehicle_number}) <br />
                    <strong>Note:</strong> {ride.note}
                  </p>
                  {userRole != 'rider' && (
                    <div className="d-flex">
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleBookRide(ride)}>Book Ride</button>
                  </div>
                  )}

                  {userRole === 'rider' && (<strong>Update Status:</strong>)}
                  {userRole === 'rider' &&  (
                    <select
                      className="form-select"
                      onChange={(event) => handleStatusChange(ride.id, event)}
                      value={ride.status}
                    >
                      <option value="">-- Select Status --</option>
                      {rideStatus.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  )}

                  {userRole === 'rider' && (
                    <Link to={`/ride/${btoa(ride.id)}`} className="btn btn-info btn-sm mt-2">View Details</Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="alert alert-warning">No rides available.</p>
      )}

      {totalRecords > limit && (
        <div className="d-flex justify-content-center mt-3">
          <div className="btn-group">
            <button className="btn btn-outline-primary" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <button className="btn btn-outline-secondary" disabled>
              Page {page}
            </button>
            <button className="btn btn-outline-primary" onClick={() => setPage((prev) => prev + 1)} disabled={page * limit >= totalRecords}>
              Next
            </button>
          </div>
        </div>
      )}

       {/* Bootstrap Modal for Ride Booking Confirmation */}
       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
       <Modal.Header closeButton>
         <Modal.Title>Confirm Booking</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <p>Are you sure you want to book this ride?</p>
         {selectedRide && (
           <p>
             <strong>From:</strong> {selectedRide.pickup} <br />
             <strong>To:</strong> {selectedRide.drop_point} <br />
             <strong>Date:</strong> {selectedRide.departure_date} <br />
             <strong>Time:</strong> {selectedRide.start_time}
           </p>
         )}
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
         <Button variant="success" onClick={confirmBooking}>Confirm</Button>
       </Modal.Footer>
     </Modal>

     {/* Toast Notification for Success & Failure */}
     <ToastContainer position="top-end" className="p-3">
       <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
         <Toast.Body className="text-white">{toastMessage}</Toast.Body>
       </Toast>
     </ToastContainer>

     {/* Confirmation Modal */}
     <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this ride as <strong>Deleted</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Rides;
