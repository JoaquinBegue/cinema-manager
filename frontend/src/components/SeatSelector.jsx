import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SeatSelector({ seatsByRow }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  return (
    <div className="container">
      {Object.entries(seatsByRow).map(([row, seats], idx) => (
        <div key={idx} className="row">
          {seats.map((seat, seatIdx) => (
            <Col key={seatIdx} className={selectedSeats.includes(seat) ? "seat occupied" : "seat"} >
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