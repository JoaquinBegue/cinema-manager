import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SeatSelector({ seatsByRow }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (e) => {
    const seatId = e.target.children[0].value;
    
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatId)) {
        e.target.classList.remove("selected");
        return prevSelectedSeats.filter((id) => id !== seatId);
      } else {
        e.target.classList.add("selected");
        return [...prevSelectedSeats, seatId];
      }
    })
  }

  return (
    <div className="container">
      {Object.entries(seatsByRow).map(([row, seats], idx) => (
        <div key={idx} className="row">
          {seats.map((seat, seatIdx) => (
            <Col key={seatIdx} className={selectedSeats.includes(seat) ? "seat occupied" : "seat"} onClick={handleSeatClick}>
              {seat.row}{seat.column}
              <input type="hidden" id="seat-id" value={seat.id}></input>
            </Col>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SeatSelector;