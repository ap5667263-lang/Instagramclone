import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyOTP, sendOTP } from "../services/authServices";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const userId = localStorage.getItem("verifyUserId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOTP(userId, "register", otp);
      localStorage.removeItem("verifyUserId");
      alert("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) return setError("Session expired. Please register again.");
    setResending(true);
    setError("");
    setSuccess("");

    try {
      await sendOTP(userId, "register");
      setSuccess("OTP resent successfully. Check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h1>Instagram</h1>
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit OTP sent to your email.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <p>
        Didn't receive the OTP?{" "}
        <button onClick={handleResend} disabled={resending} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </p>

      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default VerifyOtp;
