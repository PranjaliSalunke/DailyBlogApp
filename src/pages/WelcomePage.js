import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";

const WelcomePage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, username, role });

    setIsSubmitted(true);

    setTimeout(() => {
      navigate("/home", { state: { name, username, role } });
    }, 1500); // Redirect after 1.5 seconds
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to the Blog App</h1>

      {isSubmitted ? (
        <h2>Hey {name}, welcome to the world of blogs!</h2>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <label>Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Role: </label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
      )}
    </div>
  );
};

export default WelcomePage;
