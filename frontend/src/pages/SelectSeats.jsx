import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import Container from 'react-bootstrap/Container';
import NavBar from "../components/NavBar";
import SeatSelector from "../components/SeatSelector";

import "../styles/SelectSeats.css";

function SelectSeats() {
  const { id } = useParams();

  const [showtime, setShowtime] = useState({})
  const [movie, setMovie] = useState([]);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    getSeats();
  }, []);

  const getSeats = () => {
    const res = api.get(`/api/showtime-seats/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setShowtime(data.showtime);
        setMovie(data.movie);
        setSeats(data.seats);
      })
      .catch((err) => alert(err));
  };
  
  return (
    <>
      <NavBar page="select-seats" />

      <div className="seat-selection">
        <div className="seats-container">
          <h1 className="movie-title text-center">{movie.title}</h1>
          <div className="screen"></div>

          <SeatSelector seatsByRow={seats} />

          <ul className="showcase">
            <li>
              <div className="seat"></div>
              <small>Available</small>
            </li>
            <li>
              <div className="seat selected"></div>
              <small>Selected</small>
            </li>
            <li>
              <div className="seat occupied"></div>
              <small>Occupied</small>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default SelectSeats;