import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import NavBar from "../components/NavBar";
import ShowtimeSelector from "../components/ShowtimeSelector";
import SeatSelectorModal from "../components/SeatSelectorModal";
import AuthModal from "../components/AuthModal";

import "../styles/MovieDetails.css";

// MovieDetails component - displays detailed information about a specific movie.
function MovieDetails() {
  // Get movie ID from URL parameters.
  const { id } = useParams();
  // State variables to store movie details and showtimes.
  const [movie, setMovie] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  // Fetch movie data when component mounts or id changes.
  useEffect(() => {
    getMovie();
  }, [id]);

  // Function to fetch movie details and showtimes from the API.
  const getMovie = () => {
    const res = api
      .get(`/api/movie/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setMovie(data.movie);
        setShowtimes(data.showtimes);
      })
      .catch((err) => {
        // Only show alert for non-auth errors
        if (!err.isAuthError) {
          alert(err);
        }
      });
  };

  // Handle showtime selection.
  const handleShowtimeSelect = (showtimeId) => {
    setSelectedShowtimeId(showtimeId);
  };

  // Auth modal related.
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMethod, setAuthMethod] = useState("login");

  // Handle modal opening when logging in to select seats.
  const handleAuthClick = (method) => {
    setAuthMethod(method);
    setShowAuthModal(true);
  };

  // Set button to "Select seats" or "Log in".
  let button;
  if (selectedShowtimeId && localStorage.getItem("access")) {
    button = <SeatSelectorModal showtimeId={selectedShowtimeId} />;
  } else if (selectedShowtimeId && !localStorage.getItem("access")) {
    button = (
      <>
        <p>Log in to select seats</p>
        <Button onClick={() => handleAuthClick("login")}>Log In</Button>
      </>
    );
  }

  return (
    <>
      {/* Navigation bar component */}
      <NavBar page="movie-details" />

      <Container className="movie-details">
        <Row>
          {/* Left column - Movie information and showtimes */}
          <Col>
            <div className="movie-info">
              {/* Display basic movie information */}
              <h1>
                <strong>{movie.title}</strong>
              </h1>
              <p>
                <strong>{movie.genre}</strong>
              </p>
              <p>
                <strong>{movie.duration} minutes</strong>
              </p>
              <p>
                <strong>Directed by: </strong>
                {movie.director}
              </p>
              <p>
                <strong>Starring: </strong>
                {movie.cast}
              </p>
            </div>
            <br />
            <hr />
            <br />
            {/* Showtimes section */}
            <div className="showtimes">
              <h3>Showtimes</h3>
              <ShowtimeSelector
                showtimes={showtimes}
                onShowtimeSelect={handleShowtimeSelect}
              />
              <div className="mt-3">{button}</div>
            </div>
          </Col>

          {/* Right column - Synopsis and trailer */}
          <Col>
            <div className="movie-details-description">
              <h3>Synopsis</h3>
              {/* Display movie synopsis or placeholder text if not available */}
              <p>
                {movie.synopsis
                  ? movie.synopsis
                  : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore optio praesentium veritatis labore quo aliquid nemo consequatur deleniti officiis natus qui, possimus repudiandae impedit facere, ut soluta ad. Dolorem, eos!"}
              </p>
            </div>
            {/* Movie trailer embedded from YouTube */}
            <div className="movie-trailer">
              <iframe
                width="650"
                height="365"
                src={movie.trailer_url}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
      <AuthModal
        show={showAuthModal}
        onShow={setShowAuthModal}
        method={authMethod}
      />
    </>
  );
}

export default MovieDetails;
