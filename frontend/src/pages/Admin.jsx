// Admin page.

// Base imports.
import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

// Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import AuthForm from "../components/admin/AuthForm";
import FormContainer from "../components/admin/FormContainer";

// Styles
import "../styles/Admin.css";

// Main page that display components for each model.
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="admin-navbar navbar mb-5">
        <div className="container-fluid mx-auto">
          <span className="navbar-brand mb-0 h1 mx-auto">
            CINEMA MANAGER PANEL
          </span>
        </div>
      </nav>

      {/* Main content */}
      {isAuthenticated ? (
        <Row className="mx-3">
          <Col xs={12} md={8}>
            <FormContainer />
          </Col>

          <Col xs={12} md={4}>
            {/* Operations container */}
            <Container className="operations-container"></Container>
          </Col>
        </Row>
      ) : (
        <>
          {/* Auth form */}
          <AuthForm route="/auth/admin/login/" method="login" />
        </>
      )}
    </>
  );
}

export default Admin;
