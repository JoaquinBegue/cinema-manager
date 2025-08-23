import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import LoadingIndicator from "../LoadingIndicator";

function ReservationForm({ mode, selectedObjectId, onClose }) {
  // General form states.
  const [validData, setValidData] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Specific form states.
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [fetchingShowtimes, setFetchingShowtimes] = useState(false);
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Display states.
  const [users, setUsers] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    user: null,
    showtime: null,
    status:"",
    seats: [],
  });

  return (
    <div className="reservation-form-container mx-auto p-4">
      
    </div>
  );
}

export default ReservationForm;