import { useEffect, useState } from "react";
import api from "../api";
import MovieCard from "../components/MovieCard";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = () => {
    const res = api.get("/api/movies/")
    .then((res) => res.data)
    .then((data) => { setMovies(data); console.log(res.data); })
    .catch((err) => alert(err));
  };  

  return (
    <Container>
      <h1>Cinema</h1>
      <Row>
        {movies.map((movie) => (
          <Col key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;