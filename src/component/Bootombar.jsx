import React from "react";
import { Link, useLocation } from "react-router-dom";

const Bootombar = () => {
  const currentUrl = useLocation();
  let _class = '';
  let _homeClass = '';
  if (currentUrl.pathname == '/' || currentUrl.pathname == '/login' || currentUrl.pathname == '/register') {
    _class = 'd-none';
  } else {
    var _userDetail = sessionStorage.getItem('userDetail');
    _userDetail = JSON.parse(_userDetail);
    if (_userDetail.role != 'rider') {
      _homeClass = "d-none"
    }
  }
  
  const logout = () => {
    sessionStorage.clear(); // clear session
    // alert("Session expired. Please log in again.");
    navigate("/login");
  };
  return (
    <div className={`bottom-nav ${_class}`}>
      <div className={`nav-item ${_homeClass}`}>
        <Link to="/Dashboard" alt="Back to Home"><i className="bi bi-house"></i></Link>
      </div>
      {/* <div className="nav-item">
        <i className="bi bi-heart"></i>
      </div> */}
      <div className="nav-item">
        <Link to="/Rides" alt="Back to Rides"><i className="bi bi-bag"></i></Link>
      </div>
      <div className="nav-item">
        <Link to="/Profile" alt="Back to Profile"><i className="bi bi-person"></i></Link>

      </div>
      <div className="nav-item d-none">
        <Link alt="Back to Login" onClick={logout} ><i className="bi bi-box-arrow-right"></i></Link>
      </div>
    </div>
  );
};

export default Bootombar;
