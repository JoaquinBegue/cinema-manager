// TODO: Fix bug (when the user selects a showtime and then changes the day,
// the showtime that is in the same position as the one that the user selected
// appears selected too. but the selected showtime in the component state remains
// the same. so the user is able to select seats for a showtime that is not the
// one to appears to be selected.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";

import "../styles/SeatSelectorModal.css";

function SeatSelectorModal({ showtimeId }) {
  const [show, setShow] = useState(false);
  const [showtime, setShowtime] = useState({});
  const [movie, setMovie] = useState({});
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  // Get seats for selected showtime.
  const getSeats = () => {
    if (!showtimeId) return;

    api
      .get(`/api/showtime/${showtimeId}/`)
      .then((res) => res.data)
      .then((data) => {
        setShowtime(data.showtime);
        setMovie(data.movie);
        setSeats(data.seats);
      })
      .catch((err) => alert(err));
  };

  // Handle seat selection.
  const handleSeatClick = (e) => {
    const seatId = e.target.children[0].value;

    setSelectedSeats((prevSelectedSeats) => {
      // If the seat is already selected, remove it from the list.
      if (prevSelectedSeats.includes(seatId)) {
        e.target.classList.remove("selected");
        return prevSelectedSeats.filter((id) => id !== seatId);
        // Else, add it to the list.
      } else {
        e.target.classList.add("selected");
        return [...prevSelectedSeats, seatId];
      }
    });
  };

  // Handle booking selected seats.
  const handleBookSeats = () => {
    // Add logic for booking selected seats
    navigate(
      `/checkout/${showtimeId}/${encodeURIComponent(
        JSON.stringify(selectedSeats)
      )}`
    );
  };

  // Modal related.
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    getSeats();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Select Seats
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        dialogClassName="seat-selector-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select your seats for {movie.title} at {showtime.start_time}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="seat-selection">
            <div className="seats-container">
              <div className="screen"></div>

              <div className="container">
                {Object.entries(seats).map(([row, seats], idx) => (
                  <div key={idx} className="row">
                    {seats.map((seat, seatIdx) => (
                      <Col
                        key={seatIdx}
                        className={seat.available ? "seat" : "seat occupied"}
                        onClick={handleSeatClick}
                      >
                        {seat.row}
                        {seat.column}
                        <input
                          type="hidden"
                          id="seat-id"
                          value={seat.id}
                        ></input>
                      </Col>
                    ))}
                  </div>
                ))}
              </div>

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
