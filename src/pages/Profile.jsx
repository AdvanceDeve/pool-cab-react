import { Link,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { BG_WHITE, API_URL, checkSessionToken } from "../utility/Utils";
import "../assets/Profile.css";
import carImg from "../assets/img/profile_woman.jpg";
const Profile = () => {
  useEffect(() => {
    checkSessionToken();
    document.body.style.backgroundColor = BG_WHITE;
  }, []);
  var _userDetail = sessionStorage.getItem('userDetail');
  if (!_userDetail) {
    sessionStorage.clear();
    window.location.href = "/login";
  }
  _userDetail = JSON.parse(_userDetail);
  const [name , setName] = useState(_userDetail.name);
  const [email , setEmail] = useState(_userDetail.email);
  const [role , setRole] = useState(_userDetail.role);
  const [status , setStatus] = useState(_userDetail.status);
  const [phone , setPhone] = useState(_userDetail.phone); 
  

  const navigate = useNavigate();
  const logout = ()=>{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiry");
    sessionStorage.removeItem("userDetail");
    navigate("/login");
  }

  let _path = '/Dashboard';
  let _class = '';
  if(_userDetail.role  === 'user'){
    _path = '/Rides';
    _class = 'd-none';
  }
  return (
    <>
      <div className="profile-container">
        <div className="profile-header">           
          <Link to={_path} className="btn btn-secondary">
            ← 
          </Link>          
        </div>        
        <div className="profile-card mt-5">
        <h2 className="profile-title">Profile</h2>
          <div className="profile-image-wrapper mt-3">
            <img
              src={carImg}
              alt="Profile"
              className="profile-image"
            />
            <button className="camera-button">
              <i className="bi bi-camera"></i>
            </button>
          </div>
          <h4 className="profile-name">{name}</h4>
         

          <div className="profile-options">
            <div className="profile-option">
              <i className="bi bi-telephone me-2"></i>
              <span>+91 {phone}</span>
            </div>
            <div className="profile-option">
              <i className="bi bi-envelope me-2"></i>
              <span>{email}</span>
            </div>
            <div className="profile-option">
              <i className="bi bi-person-badge me-2"></i>
              <span>{role}</span>
            </div>              
            <div className="profile-option">
              <i className="bi bi-circle-fill me-2 text-success"></i>
              <span>{status}</span>
            </div>
            <div className={`profile-option ${_class}`}>
            <Link to="/FileUpload">
              <i className="bi bi-file me-2 text-success"></i>
              <span>Document</span></Link>  
            </div>
          </div>

          <button className="logout-button" onClick={logout}>Log Out</button>
        </div>
      </div>
    </>
  );
};

export default Profile;