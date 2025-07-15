import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import LoadingIndicator from "../LoadingIndicator";

import "../../styles/AuthForm.css";

function AuthForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/auth/token/", { username, password });
      localStorage.setItem("username", username);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      window.location.reload();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Enter credentials</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        Login
      </button>
    </form>
  );
}

export default AuthForm;
