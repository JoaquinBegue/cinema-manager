// Base imports
import { useEffect, useState } from "react";
import api from "../../api";

// Components
import { Container, Nav, Button, Row, Col } from "react-bootstrap";
import ObjectList from "./ObjectList";
import ShowtimeForm from "./ShowtimeForm";

// Styles
import "../../styles/Admin.css";

function FormContainer() {
  const objectFields = {
    showtime: {
      id: "ID",
      movie_title: "Movie",
      auditorium: "Auditorium",
      start_date: "Date",
      start_time: "Time",
      status: "Status",
    },
    movie: { id: "ID", title: "Title" },
    reservation: {
      id: "ID",
      code: "Code",
      movie_title: "Movie",
      showtime_start: "Date",
      status: "Status",
      seats: "Seats",
    },
    user: { id: "ID", email: "Email", is_staff: "Is Staff" },
  };
  const tabs = [
    { key: "showtime", label: "Showtimes" },
    { key: "movie", label: "Movies" },
    { key: "reservation", label: "Reservations" },
    { key: "user", label: "Users" },
  ];

  const [activeTab, setActiveTab] = useState({
    key: "showtime",
    label: "Showtimes",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [form, setForm] = useState({});
  const [mode, setMode] = useState("create");

  // Handlers
  const handleClick = (id, mode) => {
    setShowForm(true);
    setSelectedObjectId(id);
    setMode(mode);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedObjectId(null);
  };

  return (
    <Container className="forms-container">
      {/* Tabs */}
      <Nav justify variant="tabs" defaultActiveKey={activeTab.key}>
        {tabs.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link eventKey={tab.key} onClick={() => setActiveTab(tab)}>
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Container className="object-fields-container">
        <Row>
          {!showForm && (
            <Col xs={12} md={10}>
              <Row>
                {Object.values(objectFields[activeTab.key]).map((value) => (
                  <Col key={value}>
                    <p>
                      <strong>{value}</strong>
                    </p>
                  </Col>
                ))}
              </Row>
            </Col>
          )}
          <Col xs={12} md={2}>
            {/* Add or close buttons */}
            {showForm ? (
              <Button
                className="close-button btn"
                onClick={() => setShowForm(false)}
              >
                Close
              </Button>
            ) : (
              <Button
                className="add-button btn btn-success"
                onClick={() => handleClick(null, "create")}
              >
                Add
              </Button>
            )}
          </Col>
        </Row>
      </Container>
      {/* Object List or Form */}
      {!showForm ? (
        <ObjectList
          activeTab={activeTab}
          handleClick={handleClick}
          objectFields={objectFields[activeTab.key]}
        />
      ) : activeTab.key === "showtime" ? (
        <ShowtimeForm mode={mode} selectedObjectId={selectedObjectId} />
      ) : (
        <p>Not found</p>
      )}
    </Container>
  );
}

export default FormContainer;
