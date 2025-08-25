import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import LoadingIndicator from "../LoadingIndicator";
import "../../styles/admin/ReservationForm.css";

function ReservationForm({ mode, selectedObjectId, onClose }) {
  // General form states.
  const [validData, setValidData] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // User selection states.
  const [users, setUsers] = useState([]);
  const [selectingUser, setSelectingUser] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

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
    firstname: "",
    lastname: "",

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
    <div className="reservation-form-container mx-auto p-4">
      {selectingUser && (
        <Container className="user-selection">
          <Form>
            <Form.Group className="mb-3 w-50">
              <Form.Label>Select a user</Form.Label>
              <InputGroup>
                <Form.Control type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
                <Form.Control type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
                <Button variant="primary">Search</Button>
              </InputGroup>
            </Form.Group>
          </Form>
          {updating && (
            <Button className="user-change-button" variant="primary" onClick={() => setSelectingUser(false)}>Cancel</Button>
          )}
        </Container>
      )}
      {updating && !selectingUser && (
        <Container className="user-readonly mb-3">
          <Form.Label>User</Form.Label>
          <InputGroup className="w-50">
            <Form.Control
              type="text"
              name="user"
              value={formData.firstname + " " + formData.lastname}
              readOnly
            />
            <Button className="user-change-button" variant="primary" onClick={() => setSelectingUser(true)}>Change</Button>
          </InputGroup>
        </Container>
      )}
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
      )
      }
      <hr />
      {
        selectingShowtime && (
          <div className="showtime-selection">
            showtimes
          </div>
        )
      }
      {
        updating && !selectingSeats && (
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
        )
      }
      {
        selectingSeats && (
          <div className="seat-selection">
            seats
          </div>
        )
      }
    </div >
  );
}

export default ReservationForm;