import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log(data);

      alert("Login successful");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div>
      <h1>Instagram</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Log in
        </button>
      </form>

      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;