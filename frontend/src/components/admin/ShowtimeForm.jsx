// Form to create and update movies.

import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ShowtimeForm.css";

function ShowtimeForm({ mode, selectedObjectId }) {
  // Helper function to format date in ISO 8601 format
  const formatDate = (datetime) => {
    // Create a new date object with the local timezone
    const localTime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000);
    return localTime.toISOString();
  };

  // Form states.
  const [validData, setValidData] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [datetimeSelected, setDatetimeSelected] = useState(false);
  const [movieDuration, setMovieDuration] = useState(0);
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
  const [datetime, setDatetime] = useState(new Date());

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
          setMovieDuration(response.data.movie.duration);
          setAuditorium(response.data.auditorium);
          setDate(startDateTime);
          setDatetime(startDateTime);
          setDateSelected(true);
          setDatetimeSelected(true);
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch showtime");
        }
      };
      fetchShowtime();
    }
  }, []);

  // Validate data.
  useEffect(() => {
    if (movie && dateSelected && datetimeSelected && auditorium) {
      setValidData(true);
    }
  }, [movie, dateSelected, datetimeSelected, auditorium]);

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
    if (!auditorium || !date) return;
    const fetchReservedTimes = async () => {
      const response = await api.get(`/admin/showtimes/reserved-times/`, {
        params: { auditorium, date: formatDate(datetime) },
      });
      setReservedTimes(response.data.reserved_times);
    };
    fetchReservedTimes();
  }, [auditorium, date]);

  // Time filter function. Returns true if time is valid to book, else false.
  const filterTimes = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    
    // Check if the selected time is reserved.
    reservedTimes.forEach((reservedTime) => {
      const reservedTimeStart = new Date(reservedTime.start);
      const reservedTimeEnd = new Date(reservedTime.end);

      // Check if reserved time collides with selected time (showtime start).
      if (
        (reservedTimeStart <= selectedDate &&
        reservedTimeEnd >= selectedDate) 
      ) {
        return false;
      }

      // Check if reserved time collides with
      // selected time + movie duration + 15 minutes (showtime end).
      if (
        (reservedTimeStart <= new Date(selectedDate.getTime() + movieDuration * 60 * 1000 + 15 * 60 * 1000) &&
        reservedTimeEnd >= new Date(selectedDate.getTime() + movieDuration * 60 * 1000 + 15 * 60 * 1000)) 
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
      start: formatDate(datetime),
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
      setDatetime(new Date());
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
              setMovieDuration(movies.find((movie) => movie.id == e.target.value).duration)
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
              setDatetime(date);
              setDatetimeSelected(false);
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
              selected={datetime}
              onChange={(datetime) => {
                setDatetime(datetime);
                console.log(formatDate(datetime));
                setDatetimeSelected(true);
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
          disabled={!validData || !dateSelected || !datetimeSelected}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ShowtimeForm;
