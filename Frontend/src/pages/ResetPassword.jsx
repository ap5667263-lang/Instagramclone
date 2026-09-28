import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authServices";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      return setError("Session expired. Please request OTP again.");
    }

    setLoading(true);

    try {
      await resetPassword(resetToken, newPassword);
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetUserId");
      alert("Password reset successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Instagram</h1>
      <h2>Set New Password</h2>
      <p>Enter your new password below.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
