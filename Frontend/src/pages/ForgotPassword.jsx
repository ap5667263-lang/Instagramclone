import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOTP } from "../services/authServices";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setUserId(data.userId);
      localStorage.setItem("resetUserId", data.userId);
      setOtpSent(true);
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyOTP(userId, "password_reset", otp);
      localStorage.setItem("resetToken", data.resetToken);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setUserId(data.userId);
      localStorage.setItem("resetUserId", data.userId);
      setSuccess("OTP resent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Instagram</h1>
      <h2>Forgot Password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Step 1: Email form */}
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <p>Enter your email to receive an OTP.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        /* Step 2: OTP verify form */
        <form onSubmit={handleVerifyOtp}>
          <p>Enter the 6-digit OTP sent to <strong>{email}</strong></p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p>
            Didn't receive OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
            >
              Resend OTP
            </button>
          </p>
        </form>
      )}

      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
