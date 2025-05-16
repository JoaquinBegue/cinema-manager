import { useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card className="movie-card" onClick={handleClick}>
      <Card.Img variant="top" src={"default_poster.jpg"} />
      <Card.Body className="movie-card-body">
        <Card.Title>{movie.title}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;
