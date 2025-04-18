import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import SeatSelector from "./SeatSelector";

import "../styles/SeatSelectorModal.css";

function SeatSelectorModal({ showtimeId }) {
  const [show, setShow] = useState(false);
  const [showtime, setShowtime] = useState({});
  const [movie, setMovie] = useState({});
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    getSeats();
  };

  const getSeats = () => {
    if (!showtimeId) return;
    
    api.get(`/showtime-seats/${showtimeId}/`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data)
        setShowtime(data.showtime);
        setMovie(data.movie);
        setSeats(data.seats);
      })
      .catch((err) => alert(err));
  };

  const handleBookSeats = () => {
    // Add logic for booking selected seats
    handleClose();
    // Optionally navigate to checkout or confirmation page
    // navigate(`/checkout/${showtimeId}`);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Select Seats
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered dialogClassName="seat-selector-modal">
        <Modal.Header closeButton>
          <Modal.Title>Select Your Seats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="seat-selection">
            <div className="seats-container">
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBookSeats}>
            Book Selected Seats
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SeatSelectorModal;