import { useEffect, useState } from "react";
import { BG_WHITE, checkSessionToken, API_URL } from "../utility/Utils";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/Dashboard.css";


let userDetail = sessionStorage.getItem("userDetail");
userDetail = JSON.parse(userDetail);

const Dashboard = () => {
  const [rides, setRidesCount] = useState(0);
  const [bookings, setBookingsCount] = useState(0);

  useEffect(() => {
    checkSessionToken();
    document.body.style.backgroundColor = BG_WHITE;
    document.body.style.marginBottom = "0px";

    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}getRideAndBookingCounts/11`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setRidesCount(response.data.rides);
          setBookingsCount(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching ride/booking counts:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []);

  return (
    <div className="dashboard-container container">
      <h2>Dashboard</h2>

      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card card-blue">
            <div className="card-body text-center">
              <h3>{rides}</h3>
              <p>Total Rides</p>
              <Link to="/Rides">More info ➔</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card card-green">
            <div className="card-body text-center">
              <h3>{bookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
