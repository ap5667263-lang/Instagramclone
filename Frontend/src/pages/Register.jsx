import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, uploadProfilePicture, sendOTP } from "../services/authServices";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Register user
      const data = await registerUser({ username, email, password });
      const token = data.token;
      const userId = data.user.id;

      // Step 2: Upload profile picture if selected
      if (profilePic && token) {
        await uploadProfilePicture(token, profilePic);
      }

      // Step 3: Send OTP for email verification
      await sendOTP(userId, "register");

      // Step 4: Save userId and redirect to verify OTP
      localStorage.setItem("verifyUserId", userId);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Instagram</h1>
      <p>Sign up to see photos and videos from your friends.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* Profile Picture */}
        <div>
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span>Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
