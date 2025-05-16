//TODO: Fix movie title displaying

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import NavBar from "../components/NavBar";

import "../styles/Checkout.css";

function Checkout() {
  const { showtimeId, seatsIds } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState([]);
  const [movie, setMovie] = useState([]);
  const [seats, setSeats] = useState([]);
  const [validData, setValidData] = useState(null);
  const [code, setCode] = useState(null);

  const getData = () => {
    // Ensure seatsIds is available before proceeding
    if (!showtimeId || !seatsIds) {
      console.error("Missing required parameters: showtimeId or seatsIds");
      setValidData(false);
      return;
    }

    try {
      // Parse the seats IDs from the URL
      const parsedSeats = JSON.parse(decodeURIComponent(seatsIds));

      if (!Array.isArray(parsedSeats) || parsedSeats.length === 0) {
        console.error("Invalid seats data format");
        setValidData(false);
        return;
      }

      api
        .get(
          `/api/reserve/?showtime=${showtimeId}&seats=${parsedSeats.join(",")}`
        )
        .then((res) => res.data)
        .then((data) => {
          setShowtime(data.showtime);
          setMovie(data.showtime.movie);
          setSeats(data.seats);
          setValidData(true);
        })
        .catch((err) => {
          console.error("API error:", err);
          if (!err.isAuthError) {
            alert(err);
          }
          setValidData(false);
        });
    } catch (error) {
      console.error("Error processing seats data:", error);
      setValidData(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleConfirmBooking = () => {
    api
      .post(`/api/reserve/`, {
        showtime: showtimeId,
        seats: seats.map((seat) => seat.id),
      })
      .then((res) => res.data)
      .then((data) => {
        setCode(data.code);
      })
      .catch((err) => {
        if (!err.isAuthError) {
          alert(err);
        }
      });
  };

  let content;
  if (validData === null) {
    content = <p>Loading...</p>;
  } else if (validData === false) {
    content = <p>Showtime or seats are no longer available. Redirecting...</p>;
    setTimeout(() => {
      navigate("/");
    }, 3000);
  } else if (code) {
    content = (
      <>
        <p>Booking confirmed!</p>
        <p>Your booking code is: {code}</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <p>
          You are booking seats for {movie.title} at {showtime.start_time}
        </p>
        <p>
          Selected Seats:{" "}
          {seats.map((seat) => `${seat.row}${seat.column}`).join(", ")}
        </p>
        <Button variant="primary" onClick={handleConfirmBooking}>
          Confirm Booking
        </Button>
      </>
    );
  }

  return (
    <>
      <NavBar page="checkout" />
      <Container className="mt-5 checkout-container">
        <Row>
          <Col md={12}>
            <h2>Checkout</h2>
            {content}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Checkout;
