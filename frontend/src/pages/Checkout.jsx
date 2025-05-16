// Checkout page for reservation and reservation cancelling.

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
import Feedback from "react-bootstrap/esm/Feedback";

function Checkout() {
  const navigate = useNavigate();

  let params = useParams();
  let reserving = false;
  let cancelling = false;
  if (params.reservationId) {
    cancelling = true;
  } else {
    reserving = true;
  }

  const [data, setData] = useState(null);
  const [validData, setValidData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [code, setCode] = useState(null);

  const getData = () => {
    let url = "";

    // Reserving.
    if (reserving) {
      // Check for required parameters.
      if (!params.showtimeId || !params.seatsIds) {
        console.error("Missing required parameters: showtimeId or seatsIds");
        setValidData(false);
        return;
      }

      // Parse the seats IDs from the URL.
      const parsedSeats = JSON.parse(decodeURIComponent(params.seatsIds));

      // Check if the parsed seats data is valid.
      if (!Array.isArray(parsedSeats) || parsedSeats.length === 0) {
        console.error("Invalid seats data format");
        setValidData(false);
        return;
      }

      // Define url.
      url = `/api/reserve/?showtime=${
        params.showtimeId
      }&seats=${parsedSeats.join(",")}`;
    }

    // Canceling.
    else if (cancelling) {
      // Check for required parameters.
      if (!params.reservationId) {
        console.error("Missing required parameter: reservationId");
        setValidData(false);
        return;
      }

      url = `/api/cancel-reservation/?reservation_id=${params.reservationId}`;
    }

    try {
      api
        .get(url)
        .then((res) => res.data)
        .then((data) => {
          setData(data);
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

  const handleConfirm = () => {
    const url = reserving ? "/api/reserve/" : "/api/cancel-reservation/";
    const seats = data.seats.map((seat) => seat.id);
    const postData = reserving
      ? { showtime: params.showtimeId, seats: seats }
      : { reservation_id: params.reservationId };
    api
      .post(url, postData)
      .then((res) => res.data)
      .then((data) => {
        setCode(data.code);
        setCompleted(true);
      })
      .catch((err) => {
        if (!err.isAuthError) {
          alert(err);
        }
      });
  };

  let content;
  // Loading.
  if (validData === null) {
    content = <p>Loading...</p>;
  }
  // Data loaded.
  else {
    // Invalid data.
    if (validData === false) {
      const p = reserving
        ? "Showtime or seats are no longer available. Redirecting..."
        : "Ups! Something went wrong. Redirecting...";
      content = <p>{p}</p>;
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
    // Canceling.
    else if (!completed && cancelling) {
      content = (
        <>
          <p>
            You are cancelling a reservation for
            <strong>{" " + data.reservation.movie_title}</strong> at
            <strong>{" " + data.reservation.showtime_start}</strong>
          </p>
          <p>
            Reserved Seats:
            <strong>{" " + data.reservation.seats_formatted.join(", ")}</strong>
          </p>
          <Button variant="danger" onClick={handleConfirm}>
            Cancel Reservation
          </Button>
        </>
      );
    }
    // Reserving.
    else if (!completed && reserving) {
      content = (
        <>
          <p>
            You are booking seats for
            <strong>{" " + data.showtime.movie_title}</strong> at
            <strong>{" " + data.showtime.start_time}</strong>
          </p>
          <p>
            Selected Seats:{" "}
            <strong>
              {data.seats.map((seat) => `${seat.row}${seat.column}`).join(", ")}
            </strong>
          </p>
          <Button
            variant="primary"
            onClick={() => {
              handleConfirm();
              console.log("clicked");
            }}
          >
            Confirm Booking
          </Button>
        </>
      );
    }
    // Reservation completed.
    else if (completed) {
      const message = reserving
        ? `Booking confirmed! Your reservation code is: ${code}`
        : "Reservation cancelled successfully.";
      content = (
        <>
          <p>{message}</p>
          <Button variant="primary" onClick={() => navigate("/reservations")}>
            Go to Reservations
          </Button>
        </>
      );
    }
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
