import Card from 'react-bootstrap/Card';
import "../styles/MovieCard.css";

function MovieCard({ movie }) {
  return (
    <Card style={{ width: '18rem', height: '30rem', marginBottom: '20px' }}>
      <Card.Img variant="top" src={"default_poster.jpg"} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;