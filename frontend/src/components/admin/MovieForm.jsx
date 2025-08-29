import { useEffect, useState } from "react";
import api from "../../api";

import { Form, Button } from "react-bootstrap";
import LoadingIndicator from "../LoadingIndicator";
import Select from "react-select";

function MovieForm({ mode, selectedObjectId, onClose }) {
  // General form states.
  const [validData, setValidData] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Specific form states.
  const [genres, setGenres] = useState({});
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Display states.
  const [posterFile, setPosterFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    genres: [],
    duration: null,
    director: "",
    cast: "",
    trailer_url: ""
  });

  // Fetch genres and populate form if in update mode
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/api/movie-genres/");
        let genres_temp = [];
        response.data.forEach((genre) => {
          genres_temp.push({
            value: genre[0],
            label: genre[1],
          });
        });
        setGenres(genres_temp);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch genres");
      }
    };
    fetchGenres();

    if (mode === "update") {
      const fetchMovie = async () => {
        try {
          const response = await api.get(`/admin/movies/${selectedObjectId}/`);
          const movieData = response.data;
          setFormData({
            title: movieData.title || "",
            synopsis: movieData.synopsis || "",
            genres: movieData.genre || [],
            duration: movieData.duration || null,
            director: movieData.director || "",
            cast: movieData.cast || "",
            trailer_url: movieData.trailer_url || ""
          });
          setSelectedGenre(movieData.genre || "");
          if (movieData.poster) {
            setPreviewUrl(movieData.poster);
          }
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch movie data");
          console.log(err);
        }
      };
      fetchMovie();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e, field = null) => {
    if (field === 'genre') {
      setFormData(prev => ({
        ...prev,
        genres: e
      }));
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate form data
  useEffect(() => {
    const { title, synopsis, genres, duration, director, cast, trailer_url } = formData;
    const isValid =
      title.trim() !== "" &&
      synopsis.trim() !== "" &&
      genres.length > 0 &&
      duration !== null &&
      director.trim() !== "" &&
      cast.trim() !== "" &&
      trailer_url.trim() !== "";

    setValidData(isValid);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error and success messages.
    setError(null);
    setSuccess(null);
    // Prepare data to support files.
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "genres") {
        value.forEach((genre) => {
          formDataToSend.append("genres[]", genre.value);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    if (posterFile) {
      formDataToSend.append('poster', posterFile);
    }

    // Set headers.
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'multipart/form-data'
    };

    // Make request.
    try {
      if (mode === "create") {
        await api.post("/admin/movies/", formDataToSend, { headers });
      } else {
        await api.put(`/admin/movies/${selectedObjectId}/`, formDataToSend, { headers });
      }

      setSuccess(`Movie ${mode === "create" ? "created" : "updated"} successfully!`);

      if (createAnother) {
        // Reset form for next entry
        setFormData({
          title: "",
          synopsis: "",
          genre: "",
          duration: "",
          director: "",
          cast: "",
          trailer_url: ""
        });
        setPreviewUrl("");
        setPosterFile(null);
        setSelectedGenre("");
        setCreateAnother(false);
        setError(null);
        setSuccess(null);
        // Reset form inputs
        const form = document.querySelector('.movie-form');
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
      console.error(err);
      setError(err.response?.data?.detail || `Failed to ${mode} movie`);
    }
  };

  return (
    <div className="movie-form-container mx-auto p-4">
      {mode === "create" && <h2>Add New Movie</h2>}
      {mode === "update" && <h2>Edit Movie</h2>}

      <Form onSubmit={handleSubmit} className="movie-form">
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Synopsis */}
        <Form.Group className="mb-3">
          <Form.Label>Synopsis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Genre */}
        <Form.Group className="mb-3">
          <Form.Label>Genre</Form.Label>
          <Select
            id="genre"
            name="genre"
            onChange={(selected) => handleChange(selected, 'genre')}
            options={genres}
            isMulti
            required
          />
        </Form.Group>

        {/* Duration */}
        <Form.Group className="mb-3">
          <Form.Label>Duration (minutes)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Director */}
        <Form.Group className="mb-3">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Cast */}
        <Form.Group className="mb-3">
          <Form.Label>Cast (comma-separated)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Actor 1, Actor 2, Actor 3"
            required
          />
        </Form.Group>

        {/* Trailer URL */}
        <Form.Group className="mb-3">
          <Form.Label>Trailer URL</Form.Label>
          <Form.Control
            type="url"
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </Form.Group>

        {/* Poster Image */}
        <Form.Group className="mb-3">
          <Form.Label>Movie Poster</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Poster preview"
                style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'contain' }}
                className="img-thumbnail"
              />
            </div>
          )}
        </Form.Group>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="d-flex gap-2">
          <Button
            variant="success"
            type="submit"
            disabled={!validData}
          >
            {mode === "create" ? 'Create' : 'Update'} Movie
          </Button>

          {mode === "create" && (
            <Button
              variant="primary"
              type="submit"
              disabled={!validData}
              onClick={() => setCreateAnother(true)}
            >
              {mode === "create" ? 'Create & Add Another' : 'Update'}
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default MovieForm;