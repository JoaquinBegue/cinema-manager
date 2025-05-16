// This page displays all the movies for the user to browse.

// Base imports.
import { useEffect, useState } from "react";
import api from "../api";

// Components
import MovieCard from "../components/MovieCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "../components/NavBar";

import "../styles/Home.css";

// Home component - Main page that displays a grid of movies
function Home() {
  // State to store the list of movies
  const [movies, setMovies] = useState([]);

  // useEffect hook to fetch movies when component mounts
  useEffect(() => {
    getMovies();
  }, []); // Empty dependency array means this runs once on mount

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

  return (
    <>
      {/* Navigation bar component with "home" page indicator */}
      <NavBar page="home" />

      <div className="movies">
        {/* Create a grid with 5 columns on large screens */}
        <Row lg={5}>
          {/* Map through movies array and create a MovieCard for each movie */}
          {movies.map((movie) => (
            <Col key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Home;
