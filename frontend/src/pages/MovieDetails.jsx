import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "../components/NavBar";
import ShowtimeSelector from "../components/ShowtimeSelector";

import "../styles/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    getMovie();
  }, []);

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
      <NavBar page="movie-details" />

      <Container className="movie-details">
        <Row>
          <Col>
            <div className="movie-info">
              <h1><strong>{movie.title}</strong></h1>
              <p><strong>{movie.genre}</strong></p>
              <p><strong>{movie.duration} minutes</strong></p>
              <p><strong>Directed by: </strong>{movie.director}</p>
              <p><strong>Starring: </strong>{movie.cast}</p>
            </div>
            <br />
            <hr />
            <br />
            <div className="showtimes">
              <h3>Showtimes</h3>
              <ShowtimeSelector showtimes={showtimes} />
            </div>
          </Col>
          <Col>
            <div className="movie-details-description">
              <h3>Synopsis</h3>
              <p>{ movie.synopsis ? movie.synopsis : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore optio praesentium veritatis labore quo aliquid nemo consequatur deleniti officiis natus qui, possimus repudiandae impedit facere, ut soluta ad. Dolorem, eos!" }</p>
            </div>
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