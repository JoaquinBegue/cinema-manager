import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/AuthForm.css";

import LoadingIndicator from "./LoadingIndicator";
import Modal from "react-bootstrap/Modal";

function AuthModal({ show: externalShow, onShow, method, onSuccess }) {
  // Form related.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);

  const formName = method === "login" ? "Login" : "Register";
  const route = method === "login" ? "/auth/token/" : "/auth/register/";

  const [internalShow, setInternalShow] = useState(false);
  const show = externalShow !== undefined ? externalShow : internalShow;

  const handleSubmit = async (e) => {
    localStorage.clear();
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, {
        username: email,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      onSuccess?.();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPassword2("");
    }

    handleClose();
  };

  // Modal related.
  const handleClose = () => {
    if (externalShow !== undefined) {
      onShow?.(false);
    } else {
      setInternalShow(false);
    }
  };

  const handleShow = () => {
    if (externalShow !== undefined) {
      onShow?.(true);
    } else {
      setInternalShow(true);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="form-container">
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {method === "register" && (
              <>
                <input
                  className="form-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                <input
                  className="form-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </>
            )}
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {method === "register" && (
              <input
                className="form-input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
              />
            )}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
              {formName}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthModal;
