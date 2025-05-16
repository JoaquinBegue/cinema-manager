import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function ReservationCard({ reservation }) {
  const [canceling, setCanceling] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/checkout/cancel-reservation/${reservation.id}/`);
  };

  return (
    <Card className="reservation-card">
      <Card.Body className="reservation-card-body">
        <Card.Title>
          <h2 className="reservation-card-title mx-auto">
            {reservation.movie_title}
          </h2>
        </Card.Title>
        <Card.Text>
          Showtime: <strong>{reservation.showtime_start}</strong>
        </Card.Text>
        <Card.Text>
          Auditorium: <strong>{reservation.showtime_auditorium}</strong>
        </Card.Text>
        <Card.Text>
          Seats: <strong>{reservation.seats_formatted.join(", ")}</strong>
        </Card.Text>
        <Card.Text>
          Status:{" "}
          <strong>
            {reservation.status[0].toUpperCase() + reservation.status.slice(1)}
          </strong>
        </Card.Text>
        <Card.Title>
          <h3 className={"reservation-code " + reservation.status}>
            <strong>{reservation.code}</strong>
          </h3>
          {reservation.status === "valid" && !canceling && (
            <Button
              variant="outline-danger mt-2"
              onClick={() => setCanceling(true)}
            >
              Cancel reservation
            </Button>
          )}
          {reservation.status === "valid" && canceling && (
            <>
              <Card.Text className="cancel-confirmation">
                Are you sure you want to
                <br />
                cancel this reservation?
              </Card.Text>
              <Button variant="outline-danger mx-2" onClick={handleClick}>
                Yes
              </Button>
              <Button
                variant="outline-light mx-2"
                onClick={() => setCanceling(false)}
              >
                No
              </Button>
            </>
          )}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ReservationCard;
