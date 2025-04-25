export const APP_NAME = "My React App";
const _is_production = false;
export const delayNavigation = (navigate, path, delay = 3000) => {
  setTimeout(() => {
    navigate(path);
  }, delay);
};

export const formatText = (text) => {
  return text.trim().toUpperCase();
};

export const BG_ORANGE = '#ffa704';
export const BG_WHITE = '#ffffff';

export const API_URL = _is_production
  ? "https://your-production-url.com/api/"
  : "http://localhost:5000/api/";



export const getRequest = async (endpoint) => {
  try {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage

    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async ()=>{
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiry');
  sessionStorage.removeItem('user');
}

export const rideStatus = [
  'yet_to_start','ongoing','completed','canceled','deleted'
]

export const checkSessionToken = () => {
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("expiry");

  if (!token || !expiry) {
    window.location.href = "/login";
    return false;
  }

  // Optional: Check if token is expired
  const now = new Date().getTime();
  if (now > parseInt(expiry)) {
    sessionStorage.clear();
    window.location.href = "/login";
    return false;
  }

  return true;
};