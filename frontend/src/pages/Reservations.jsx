// This page displays all the reservations of the user.
import React, { useState, useEffect } from "react";
import api from "../api";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import NavBar from "../components/NavBar";
import ReservationCard from "../components/ReservationCard";

import "../styles/Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api
          .get("/api/reservations/")
          .then((res) => res.data)
          .then((data) => {
            setReservations(data);
          });
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <>
      <NavBar page="reservations" />

      <div className="reservations">
        <h1 className="reservations-title">Reservations</h1>
        {/* Create a grid with 5 columns on large screens */}
        <Row lg={5}>
          {/* Map through movies array and create a MovieCard for each movie */}
          {reservations.map((reservation) => (
            <Col key={reservation.id}>
              <ReservationCard reservation={reservation} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Reservations;
