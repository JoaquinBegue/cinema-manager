import { useEffect, useState } from "react";
import api from "../../api";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import LoadingIndicator from "../LoadingIndicator";
import "../../styles/admin/ReservationForm.css";

function ReservationForm({ mode, selectedObjectId, onClose }) {
  // General form states.
  const [validData, setValidData] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Showtime selection states.
  const [showtimes, setShowtimes] = useState([]);
  const [fetchingShowtimes, setFetchingShowtimes] = useState(false);
  const [selectingShowtime, setSelectingShowtime] = useState(false);

  // Seat selection states.
  const [seats, setSeats] = useState([]);
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [updating, setUpdating] = useState(true);
  const [selectingSeats, setSelectingSeats] = useState(false);

  // Display states.

  // Form data
  const [formData, setFormData] = useState({
    user: null,

    showtime: null,
    status: "",
    seats: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="reservation-form-container mx-auto p-4">
      <Container className="user-selection">
        <Form>
          <Form.Label>User email</Form.Label>
          <InputGroup className="w-50">
            <Form.Control
              type="email"
              name="user"
              value={formData.user}
              placeholder="user@example.com"
              onChange={handleChange}
            />
          </InputGroup>
        </Form>
      </Container>
      <hr />
      {updating && !selectingShowtime && (
        <Container className="showtime-readonly mb-3">
          <Form.Label>Showtime</Form.Label>
          <InputGroup className="w-50">
            <Form.Control
              type="text"
              name="showtime"
              value={formData.showtime}
              readOnly
            />
            <Button className="user-change-button" variant="primary" onClick={() => setSelectingShowtime(true)}>Change</Button>
          </InputGroup>
        </Container>
      )}
      {selectingShowtime && (
        <Container className="showtime-selection">
          showtimes
        </Container>
      )}
      <hr />
      {updating && !selectingSeats && (
        <Container className="seats-readonly mb-3">
          <Form.Label>Seats</Form.Label>
          <InputGroup className="w-50">
            <Form.Control
              type="text"
              name="seats"
              value={formData.seats}
              readOnly
            />
            <Button className="user-change-button" variant="primary" onClick={() => setSelectingSeats(true)}>Change</Button>
          </InputGroup>
        </Container>
      )}
      {selectingSeats && (
        <Container className="seat-selection">
          seats
        </Container>
      )}
    </Container >
  );
}

export default ReservationForm;