// Form to create and update movies.

import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingIndicator from "../LoadingIndicator";
import "./ShowtimeForm.css";

function ShowtimeForm({ mode, selectedObjectId, onClose }) {
  // Form states.
  const [validData, setValidData] = useState(false);
  const [fetchingTimes, setFetchingTimes] = useState(false);
  const [noTimesAvailable, setNoTimesAvailable] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Display states.
  const [movies, setMovies] = useState([]);
  const auditoriums = [1, 2, 3, 4, 5];
  const [availableTimes, setAvailableTimes] = useState([]);
  const [movieDuration, setMovieDuration] = useState(0);

  // Form data.
  const [movie, setMovie] = useState(null);
  const [auditorium, setAuditorium] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

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
          setMovieDuration(response.data.movie_duration);
          setAuditorium(response.data.auditorium);
          const startDate = new Date(response.data.start);
          setDate(startDate);
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch showtime");
        }
      };
      fetchShowtime();
    }
  }, []);

  // Fetch available times any time the auditorium or date changes.
  useEffect(() => {
    if (!auditorium || !date) return;
    const fetchAvailableTimes = async () => {
      setFetchingTimes(true);
      const response = await api.get(`/admin/showtimes/available-times/`, {
        params: {
          auditorium,
          date: date.toISOString(),
          movie_duration: movieDuration,
        },
      });
      if (response.data.available_times.length === 0) {
        setNoTimesAvailable(true);
      } else {
        setNoTimesAvailable(false);
      }
      setAvailableTimes(response.data.available_times);
      setTimeout(() => {
        setFetchingTimes(false);
      }, 1000);
    };
    fetchAvailableTimes();
  }, [auditorium, date]);

  // Time filter function for date picker.
  const filterDate = (date) => {
    // Filter dates that are past today and less than 3 days from today.
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const daysLeftInMiliseconds =
      Math.floor(currentDate.getTime() - selectedDate.getTime()) +
      3 * 24 * 60 * 60 * 1000;
    return (
      currentDate.getTime() + daysLeftInMiliseconds < selectedDate.getTime()
    );
  };

  // Validate data.
  useEffect(() => {
    if (movie && date && time && auditorium) {
      setValidData(true);
    }
  }, [movie, date, time, auditorium]);

  // Reset form function
  const resetForm = () => {
    // Reset form state
    setMovie(null);
    setAuditorium(null);
    setDate(null);
    setTime(null);
    setValidData(false);
    setFetchingTimes(false);
    setNoTimesAvailable(false);
    setCreateAnother(false);
    setError("");
    setSuccess("");
    
    // Reset form inputs
    const form = document.querySelector('.showtime-form');
    if (form) {
      form.reset();
    }
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
      date: date.toISOString(),
      time: time,
    };

    // Set headers.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    // Make request.
    try {
      if (mode === "create") {
        await api.post("/admin/showtimes/", formData, { headers });
      } else {
        await api.put(`/admin/showtimes/${selectedObjectId}/`, formData, { headers });
      }
      
      setSuccess(`Showtime ${mode === "create" ? "created" : "updated"} successfully!`);
      
      if (!createAnother) {
        // Close the form after a delay
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Reset form for next entry
        resetForm();
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || `Failed to ${mode} showtime`);
    }
  };

  // Update form data.
  const handleChange = (e, extra = null) => {
    const { name, value } = e.target;
    switch (name) {
      case "movie":
        setMovie(value);
        setMovieDuration(movies.find((extra) => extra.id == value).duration);
        break;
      case "auditorium":
        setAuditorium(value);
        setTime(null);
        break;
      case "time":
        setTime(value);
        break;
    }
  };

  return (
    <div className="showtime-form-container mx-auto p-2">
      {mode === "create" && <h2>Create Showtime</h2>}
      {mode === "update" && <h2>Update Showtime #{selectedObjectId}</h2>}
      <Form onSubmit={handleSubmit} className="showtime-form">
        {/* Movie selector */}
        <div className="form-group">
          <label htmlFor="movie">Movie</label>
          <select
            id="movie"
            name="movie"
            value={movie}
            onChange={(e) => handleChange(e, movie)}
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

        {/* Auditorium selector */}
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

        {/* Date picker */}
        <div className="date-picker-container">
          <label htmlFor="start-date">Start Date</label>
          <DatePicker
            id="start-date"
            name="start-date"
            inline
            selected={date}
            onChange={(date) => {
              setDate(date);
              setTime(null);
            }}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            filterDate={filterDate}
          />
        </div>

        {/* Time selector */}
        {date && auditorium && !fetchingTimes && !noTimesAvailable && (
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={time}
              onChange={handleChange}
              size={10}
              required
            >
              {availableTimes.map((time) => (
                <option className="time-option" key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}
        {fetchingTimes && <LoadingIndicator />}
        {noTimesAvailable && <div className="error-message">No times available</div>}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <Button type="submit" className="btn btn-success submit-button" disabled={!validData}>
          Submit
        </Button>
        {mode == "create" && (
          <Button type="submit" className="btn btn-primary submit-button" disabled={!validData} onClick={() => setCreateAnother(true)}>
            Submit and create another
          </Button>
        )}
      </Form>
    </div>
  );
}

export default ShowtimeForm;
