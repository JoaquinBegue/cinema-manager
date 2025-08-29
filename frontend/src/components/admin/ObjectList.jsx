// Base imports
import { useState, useEffect } from "react";
import api from "../../api";
import { refreshApi } from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

// Components
import { Container, ListGroup, Row, Col, Button, Alert } from "react-bootstrap";

function ObjectList({ activeTab, handleClick, objectFields }) {
  const [objects, setObjects] = useState([]);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getObjects = async () => {
    try {
      const response = await api.get(`admin/${activeTab.key}s`);
      setObjects(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab.label}:`, error);
    }
  };

  // Handle delete request.
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // Confirm user password and save new tokens.
      const username = localStorage.getItem("username");
      console.log(username)
      const res = await refreshApi.post("/auth/token/", { username, password });
      if (res.status == 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        // make delete request
        const deleteRes = await api.delete(
          `admin/${activeTab.key}s/${currentDeleteId}/`
        );
        console.log(deleteRes);
      }
      // Reset delete state after successful authentication
      setDeletedId(currentDeleteId);
      setCurrentDeleteId(null);
      setPassword("");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting object:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch objects on tab change
  useEffect(() => {
    getObjects();
  }, [activeTab]);

  return (
    <Container className="list-container">
      <ListGroup variant="flush">
        {objects.map((object) => (
          <ListGroup.Item key={object.id}>
            <Row>
              <Col xs={12} md={10}>
                <Row>
                  {Object.entries(objectFields).map(([key, value]) => (
                    <Col key={key}>
                      <p>
                        {value === "Start" ? (
                          <>
                            {object[key].year}-{object[key].month}-
                            {object[key].day} {object[key].hour}:
                            {object[key].minute}
                          </>
                        ) : (
                          object[key]
                        )}
                      </p>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col xs={12} md={2}>
                {currentDeleteId !== object.id ? (
                  <>
                    <Button
                      className="m-1"
                      onClick={() => handleClick(object.id, "update")}
                    >
                      Update
                    </Button>
                    <Button
                      className="m-1"
                      variant="danger"
                      onClick={() => {
                        setCurrentDeleteId(object.id);
                        setPassword("");
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleSubmit} className="input-group mb-3">
                      <input
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <button type="submit" className="btn btn-outline-danger">
                        Delete
                      </button>
                    </form>
                    <Button
                      className="w-100"
                      onClick={() => {
                        setCurrentDeleteId(null);
                        setPassword("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ObjectList;
