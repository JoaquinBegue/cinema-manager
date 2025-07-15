// Base imports
import { useEffect, useState } from "react";
import api from "../../api";

// Components
import { Container, Nav, Button } from "react-bootstrap";
import ObjectList from "./ObjectList";
import ShowtimeForm from "./ShowtimeForm";

// Styles
import "../../styles/Admin.css";

function FormContainer() {
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
      {/* Add or close buttons */}
      <Container>
        {showForm ? (
          <Button onClick={() => setShowForm(false)}>Close</Button>
        ) : (
          <Button onClick={() => handleClick(null, "create")}>Add</Button>
        )}
      </Container>
      {/* Object List or Form */}
      {!showForm ? (
        <ObjectList activeTab={activeTab} handleClick={handleClick} />
      ) : activeTab.key === "showtime" ? (
        <ShowtimeForm mode={mode} selectedObjectId={selectedObjectId} />
      ) : (
        <p>Not found</p>
      )}
    </Container>
  );
}

export default FormContainer;
