import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://https://photo-sharing-platform-backend.onrender.com/users/u", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      <div className="branding">
        <h1>
          Photo<span>Share</span>
        </h1>

        <h2>
          Create
          <br />
          Your <span>Account</span>
        </h2>

        <p>
          Join PhotoShare and start managing
          <br />
          your photography events.
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

        <h3>Create Account</h3>

        <p className="subtitle">
          Sign up to get started
        </p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="ADMIN">Admin / Lead</option>
            <option value="TEAM_MEMBER">Team Member</option>
          </select>

          <button type="submit">
            Create Account →
          </button>

        </form>

        <p className="signup">
          Already have an account?

          <Link to="/" className="signup-link">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;