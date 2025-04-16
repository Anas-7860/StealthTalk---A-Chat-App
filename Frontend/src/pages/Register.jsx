import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0b0c10, #1f2833, #45a29e)",
        color: "white",
      }}
    >
      <Row className="w-100" style={{ maxWidth: "1000px" }}>
        {/* Register Form - Left */}
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Card
            className="p-4 shadow-lg border-0"
            style={{
              width: "100%",
              maxWidth: "400px",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(20, 20, 20, 0.85)",
              borderRadius: "15px",
              color: "white",
            }}
          >
            <h2 className="text-center mb-4">Create an Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-0 p-2 bg-dark text-white"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 p-2 bg-dark text-white"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-0 p-2 bg-dark text-white"
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
                Register
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Punch Line - Right */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-end px-4 text-end"
        >
          <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
            Step into the silence
            <span role="img" aria-label="shh" style={{ fontSize: "2rem", marginLeft: "10px" }}>
              🤫
            </span>
          </h1>
          <h4 className="text-info fst-italic">Your identity begins with a whisper.</h4>
          <p className="mt-2 text-light">
            Register on <strong>StealthTalk</strong> to unlock secure and anonymous communication.  
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
