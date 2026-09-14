import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
       const data = await loginUser(email, password);

console.log("Login successful:", data);
alert("Login successful!");

if (data.role === "ADMIN") {
  navigate("/admin");
} else if (data.role === "TEAM_MEMBER") {
  navigate("/team");
}
    }
     catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="login-page">

      <div className="branding">
        <h1>
          Photo<span>Share</span>
        </h1>

        <h2>
          Share
          <br />
          Your <span>Moments</span>
        </h2>

        <p>
          Upload, organize and share your memories
          <br />
          with the people who matter.
        </p>

        <div className="features">
          <div>
            <strong>☁</strong>
            <span>
              Upload
              <br />
              Photos
            </span>
          </div>

          <div>
            <strong>👥</strong>
            <span>
              Connect
              <br />
              With Friends
            </span>
          </div>

          <div>
            <strong>♥</strong>
            <span>
              Relive
              <br />
              Memories
            </span>
          </div>
        </div>
      </div>

      <div className="login-card">

        <div className="card-logo">
          📷 Photo<span>Share</span>
        </div>

        <h3>Welcome Back</h3>

        <p className="subtitle">
          Login to continue sharing your story
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="✉  Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒  Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <span>Forgot password?</span>
          </div>

          <button type="submit">
            Login →
          </button>

        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-buttons">
          <button type="button">🌈 Google</button>
          <button type="button">◉ GitHub</button>
        </div>

        <p className="signup">
          Don't have an account?

          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;