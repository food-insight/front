import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/users";

const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.user;
};

const updateProfile = async (token, updatedData) => {
  const response = await axios.put(`${API_URL}/profile`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export { getProfile, updateProfile };
