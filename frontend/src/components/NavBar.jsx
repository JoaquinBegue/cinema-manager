// Import necessary components from react-bootstrap
import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Form, Nav, Navbar } from "react-bootstrap";
import AuthModal from "./AuthModal";
import SearchBar from "./SearchBar";

import "../styles/NavBar.css";

/**
 * NavBar component that displays the main navigation bar
 * @param {Object} props - Component props
 * @param {string} props.page - Current page identifier
 */
function NavBar({ page }) {
  // Auth modal related.
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMethod, setAuthMethod] = useState("login");
  // Search bar related.
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  const handleAuthClick = (method) => {
    setAuthMethod(method);
    setShowAuthModal(true);
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Function to fetch movies from the API
  const getMovies = () => {
    const res = api
      .get("/api/movies/")
      .then((res) => res.data)
      .then((data) => {
        let movies_temp = [];
        data.forEach((movie) => {
          movies_temp.push({
            id: movie.id,
            label: movie.title,
          });
        });
        setMovies(movies_temp); // Update movies state with fetched data
      })
      .catch((err) => alert(err)); // Show alert if there's an error
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    // Main Navbar component with dark theme
    <>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
      >
        <Container fluid>
          {/* Hamburger menu toggle for mobile view */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {/* Navigation links container */}
            <Nav
              className="navbar-left my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {/* Conditional rendering of Home link - only shows if not on home page */}
              {page !== "home" && <Nav.Link href="/">Home</Nav.Link>}
              {/* Login/Register links for unauthenticated users */}
              {!localStorage.getItem("access") && (
                <>
                  <Nav.Link onClick={() => handleAuthClick("login")}>
                    Log In
                  </Nav.Link>
                  <Nav.Link onClick={() => handleAuthClick("register")}>
                    Register
                  </Nav.Link>
                </>
              )}
              {localStorage.getItem("access") && (
                <>
                  {page != "reservations" && (
                    <Nav.Link href="/reservations">My Reservations</Nav.Link>
                  )}
                  <Nav.Link href="/logout">Log Out</Nav.Link>
                </>
              )}
            </Nav>
            {/* Brand logo/text that links to home page */}
            <Navbar.Brand className="mx-auto my-0" href="/">
              <h1 className="brand-logo my-0">CINEMA</h1>
            </Navbar.Brand>
            {/* Search form with dropdown */}
            <SearchBar className="navbar-right d-flex position-relative search-bar" placeholder="Search movies..." objects={movies} handleSelection={handleMovieClick} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AuthModal
        show={showAuthModal}
        onShow={setShowAuthModal}
        method={authMethod}
      />
    </>
  );
}

export default NavBar;
