import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h2>Register</h2>
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default Register;