import { useEffect, useState } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingIndicator from "../LoadingIndicator";
import "./ShowtimeForm.css";

function ShowtimeForm({ mode, selectedObjectId, onClose }) {
  // General form states.
  const [validData, setValidData] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Specific form states.
  const [fetchingTimes, setFetchingTimes] = useState(false);
  const [noTimesAvailable, setNoTimesAvailable] = useState(false);
  const [newDateSelected, setNewDateSelected] = useState(false);
  
  // Display states.
  const [movies, setMovies] = useState([]);
  const auditoriums = [1, 2, 3, 4, 5];
  const [availableTimes, setAvailableTimes] = useState([]);

  // Form data.
  const [formData, setFormData] = useState({
    movie: null,
    auditorium: null,
    date: null,
    time: null,
  });

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
          const startDate = new Date(response.data.start);
          setFormData({
            movie: response.data.movie,
            auditorium: response.data.auditorium,
            date: startDate,
            time: response.data.time,
          });
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch showtime");
        }
      };
      fetchShowtime();
    }
  }, []);

  // Fetch available times any time a field changes.
  useEffect(() => {
    if (mode === "update" && !newDateSelected) return;
    if (!formData.movie || !formData.auditorium || !formData.date) return;
    const fetchAvailableTimes = async () => {
      setFetchingTimes(true);
      const response = await api.get(`/admin/showtimes/available-times/`, {
        params: {
          auditorium: formData.auditorium,
          date: formData.date.toISOString(),
          movie: formData.movie,
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
  }, [formData.auditorium, formData.date, formData.movie]);

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

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      const time = name === "time" ? value : "";
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ["time"]: time
      }));
    }
    catch (err) {
      setFormData(prev => ({
        ...prev,
        ["date"]: e,
        ["time"]: ""
      }));
      setNewDateSelected(true);
    }
  };

  // Validate form data.
  useEffect(() => {
    console.log(formData)
    const { movie, date, time, auditorium } = formData;
    const isValid = movie && date && time && auditorium;
    setValidData(isValid);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error and success messages.
    setError(null);
    setSuccess(null);
    // Format date.
    formData.date = formData.date.toISOString();
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
      
      if (createAnother) {
        // Reset form for next entry
        setFormData({
          movie: "",
          auditorium: "",
          date: null,
          time: "",
        });
        setValidData(false);
        setFetchingTimes(false);
        setNoTimesAvailable(false);
        setCreateAnother(false);
        setError(null);
        setSuccess(null);
        
        // Reset form inputs
        const form = document.querySelector('.showtime-form');
        if (form) {
          form.reset();
        }
      } else {
        // Close the form after a delay
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || `Failed to ${mode} showtime`);
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
            value={formData.movie}
            onChange={handleChange}
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
            value={formData.auditorium}
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
            selected={formData.date}
            onChange={handleChange}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            filterDate={filterDate}
          />
        </div>

        {/* Time selector */}
        {formData.date && formData.auditorium && formData.movie && !fetchingTimes && !noTimesAvailable && newDateSelected &&(
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
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
