import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "../components/NavBar";
import ShowtimeSelector from "../components/ShowtimeSelector";

import "../styles/MovieDetails.css";

// MovieDetails component - displays detailed information about a specific movie
function MovieDetails() {
  // Get movie ID from URL parameters
  const { id } = useParams();
  // State variables to store movie details and showtimes
  const [movie, setMovie] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  // Fetch movie data when component mounts
  useEffect(() => {
    getMovie();
  }, []);

  // Function to fetch movie details and showtimes from the API
  const getMovie = () => {
    const res = api.get(`/api/movie/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setMovie(data.movie);
        setShowtimes(data.showtimes);
      })
      .catch((err) => alert(err));
  };

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
              <h1><strong>{movie.title}</strong></h1>
              <p><strong>{movie.genre}</strong></p>
              <p><strong>{movie.duration} minutes</strong></p>
              <p><strong>Directed by: </strong>{movie.director}</p>
              <p><strong>Starring: </strong>{movie.cast}</p>
            </div>
            <br />
            <hr />
            <br />
            {/* Showtimes section */}
            <div className="showtimes">
              <h3>Showtimes</h3>
              <ShowtimeSelector showtimes={showtimes} />
            </div>
          </Col>

          {/* Right column - Synopsis and trailer */}
          <Col>
            <div className="movie-details-description">
              <h3>Synopsis</h3>
              {/* Display movie synopsis or placeholder text if not available */}
              <p>{ movie.synopsis ? movie.synopsis : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore optio praesentium veritatis labore quo aliquid nemo consequatur deleniti officiis natus qui, possimus repudiandae impedit facere, ut soluta ad. Dolorem, eos!" }</p>
            </div>
            {/* Movie trailer embedded from YouTube */}
            <div className="movie-trailer">
              <iframe width="650" height="365" src={ movie.trailer_url }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MovieDetails;