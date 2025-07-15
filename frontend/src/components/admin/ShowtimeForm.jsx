// Form to create and update movies.

import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ShowtimeForm.css";

function ShowtimeForm({ mode, selectedObjectId }) {
  // Helper function to format date in ISO 8601 format
  const formatDate = (date, time) => {
    const formatedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
    );

    return formatedDate.toISOString();
  };

  // Form states.
  const [validData, setValidData] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Display states.
  const [movies, setMovies] = useState([]);
  const auditoriums = [1, 2, 3, 4, 5];
  const [reservedTimes, setReservedTimes] = useState([]);

  // Form data.
  const [movie, setMovie] = useState("");
  const [auditorium, setAuditorium] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  // Fetch movies and populate form if updating.
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get(`/admin/movies/`);
        setMovies(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch movies");
      }
    };
    fetchMovies();
    if (mode === "update") {
      const fetchShowtime = async () => {
        try {
          const response = await api.get(
            `/admin/showtimes/${selectedObjectId}/`
          );
          setMovie(response.data.movie);
          const startDateTime = new Date(response.data.start);
          setAuditorium(response.data.auditorium);
          setDate(startDateTime);
          setTime(startDateTime);
          setTimeSelected(true);
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch showtime");
        }
      };
      fetchShowtime();
    }
  }, []);

  // Validate data.
  useEffect(() => {
    if (movie && dateSelected && timeSelected && auditorium) {
      setValidData(true);
    }
  }, [movie, dateSelected, timeSelected, auditorium]);

  // Update form data.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "movie") {
      setMovie(value);
    } else if (name === "auditorium") {
      setAuditorium(value);
    }
  };

  // Fetch reserved times any time the auditorium or date changes.
  useEffect(() => {
    const fetchReservedTimes = async () => {
      const response = await api.get(`/admin/showtimes/reserved-times/`, {
        params: { auditorium, date: formatDate(date, time) },
      });
      setReservedTimes(response.data.reserved_times);
    };
    fetchReservedTimes();
  }, [auditorium, date]);

  // Time filter function
  const filterTimes = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    // Check if the selected time is reserved.
    reservedTimes.forEach((reservedTime) => {
      if (
        reservedTime.start <= selectedDate &&
        reservedTime.end >= selectedDate
      ) {
        return false;
      }
    });

    // Filter out times that are before the current date.
    return currentDate.getTime() <= selectedDate.getTime();
  };

  // Submit form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error and success messages.
    setError("");
    setSuccess("");
    // Set start datetime and route.
    const formData = {
      movie: movie,
      auditorium: auditorium,
      start: formatDate(date, time),
    };

    // Set headers.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    // Make request.
    try {
      if (mode === "create") {
        await api.post("/admin/showtimes/", formData, {
          headers,
        });
      } else {
        await api.put(`/admin/showtimes/${selectedObjectId}/`, formData, {
          headers,
        });
      }
      setSuccess(
        `Showtime ${mode === "create" ? "created" : "updated"} successfully!`
      );
      // Reset form
      setMovie(null);
      setAuditorium(null);
      setDate(new Date());
      setTime(new Date());
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${mode} showtime`);
    }
  };

  return (
    <div className="showtime-form-container mx-auto p-2">
      {mode === "create" && <h2>Create Showtime</h2>}
      {mode === "update" && <h2>Update Showtime</h2>}
      <Form onSubmit={handleSubmit} className="showtime-form">
        <div className="form-group">
          <label htmlFor="movie">Movie</label>
          <select
            id="movie"
            name="movie"
            value={movie}
            onChange={(e) => {
              setMovie(e.target.value);
              handleChange(e);
            }}
            required
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="auditorium">Auditorium</label>
          <select
            id="auditorium"
            name="auditorium"
            value={auditorium}
            onChange={handleChange}
            required
          >
            <option value=""></option>
            {auditoriums.map((auditorium) => (
              <option key={auditorium} value={auditorium}>
                {auditorium}
              </option>
            ))}
          </select>
        </div>

        <div className="date-picker-container">
          <label htmlFor="start-date">Start Date</label>
          <DatePicker
            id="start-date"
            name="start-date"
            inline
            selected={date}
            onChange={(date) => {
              setDate(date);
              setDateSelected(true);
            }}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </div>

        {(dateSelected || mode === "update") && (
          <div className="date-picker-container">
            <label htmlFor="start-time">Start Time</label>
            <DatePicker
              id="start-time"
              name="start-time"
              selected={time}
              onChange={(time) => {
                setTime(time);
                setTimeSelected(true);
              }}
              inline
              showTimeSelect
              showTimeSelectOnly
              filterTime={filterTimes}
              timeIntervals={15}
              dateFormat="h:mm aa"
              showTimeCaption={false}
              className="date-picker"
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <Button
          type="submit"
          className="submit-button"
          disabled={!validData || !dateSelected || !timeSelected}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ShowtimeForm;
