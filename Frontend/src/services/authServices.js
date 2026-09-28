import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (resetToken, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { resetToken, newPassword });
  return response.data;
};

export const uploadProfilePicture = async (token, imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  const response = await axios.post(
    "http://localhost:5000/api/profile/picture",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const sendOTP = async (userId, purpose) => {
  const response = await axios.post("http://localhost:5000/api/otp/send-otp", {
    userId,
    purpose,
  });
  return response.data;
};

export const verifyOTP = async (userId, purpose, otp) => {
  const response = await axios.post("http://localhost:5000/api/otp/verify-otp", {
    userId,
    purpose,
    otp,
  });
  return response.data;
};