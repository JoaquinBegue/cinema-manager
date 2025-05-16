// Import necessary components from react-bootstrap
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import api from "../api";
import { useNavigate } from "react-router-dom";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  const handleAuthClick = (method) => {
    setAuthMethod(method);
    setShowAuthModal(true);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const searchMovies = (searchQuery) => {
    setSearchQuery(searchQuery);
    if (searchQuery.length > 2) {
      let results = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Function to fetch movies from the API
  const getMovies = () => {
    const res = api
      .get("/api/movies/")
      .then((res) => res.data)
      .then((data) => {
        setMovies(data); // Update movies state with fetched data
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
        className="bg-body-tertiary"
        bg="dark"
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
            <Form className="navbar-right d-flex position-relative">
              <Form.Control
                type="search"
                placeholder="Search movies..."
                className="ms-auto me-2 w-75"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => searchMovies(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    e.preventDefault();
                    handleMovieClick(searchResults[0].id);
                  }
                }}
              />
              {/* Search results dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="search-results-dropdown ms-auto me-2">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="search-result-item"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      {movie.title}
                    </div>
                  ))}
                </div>
              )}
            </Form>
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
