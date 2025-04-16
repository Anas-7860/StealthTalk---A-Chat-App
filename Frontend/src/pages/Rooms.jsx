import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/authContext.jsx";
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ name: "", description: "", isPrivate: false });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/api/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/rooms", newRoom);
      setRooms([...rooms, res.data]);
      setNewRoom({ name: "", description: "", isPrivate: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-start min-vh-100"
      style={{
        paddingTop: "20px",
        background: "linear-gradient(135deg, #0b0c10, #1f2833, #45a29e)",
        color: "white",
      }}
    >
      <h2 className="mb-4">Available Rooms</h2>

      {user && (
        <Card
          className="p-4 mb-4 shadow-lg"
          style={{
            width: "400px",
            backgroundColor: "rgba(20, 20, 20, 0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
          }}
        >
          <h5 className="mb-3 text-center">Create a New Room</h5>
          <Form onSubmit={handleCreateRoom}>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
                className="border-0 p-2 bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                className="border-0 p-2 bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Private Room"
                checked={newRoom.isPrivate}
                onChange={(e) => setNewRoom({ ...newRoom, isPrivate: e.target.checked })}
                className="text-light"
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100 fw-bold"
              style={{
                backgroundColor: "#66fcf1",
                border: "none",
                padding: "10px",
                color: "#1f2833",
              }}
            >
              Create Room
            </Button>
          </Form>
        </Card>
      )}

      <Row className="w-100 d-flex justify-content-center">
        {rooms.length === 0 && (
          <Alert variant="info" className="text-center w-50">
            No rooms available. Create one!
          </Alert>
        )}
        {rooms.map((room) => (
          <Col key={room._id} md={4} className="mb-4">
            <Card
              className="p-3 text-center shadow-lg"
              style={{
                backgroundColor: "rgba(25, 25, 25, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                color: "white",
              }}
            >
              <h5 className="mb-2">{room.name}</h5>
              <p className="text-muted">{room.description || "No description"}</p>
              {user && (
                <Button
                  onClick={() => handleJoinRoom(room._id)}
                  className="fw-bold"
                  style={{
                    backgroundColor: "#66fcf1",
                    border: "none",
                    color: "#1f2833",
                    padding: "8px 15px",
                  }}
                >
                  Join Room
                </Button>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Rooms;
