import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = ({ timeout = 15 * 60 * 1000 }) => { // 15 minutes
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = () => {
    sessionStorage.clear(); // clear session
    alert("Session expired. Please log in again.");
    navigate("/login");
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Start on mount

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, []);

  return null;
};

export default SessionTimeout;
