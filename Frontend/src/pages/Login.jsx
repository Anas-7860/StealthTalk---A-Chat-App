import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, guestLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
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
        {/* Punch Line Left */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center align-items-start px-4"
        >
          <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
            <span role="img" aria-label="shh" style={{ fontSize: "2rem", marginRight: "10px" }}>
              🤫
            </span>
            Welcome to the world of whispers
          </h1>
          <h3 className="text-info fst-italic">StealthTalk</h3>
          <p className="mt-2 text-light">
            Speak freely. Stay anonymous. Join secure conversations without revealing your identity.
          </p>
        </Col>

        {/* Login Form Right */}
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
            }}
          >
            <h2 className="text-center mb-4 text-white">Welcome Back</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-0 p-2 bg-dark text-white"
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white">
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
                Login
              </Button>
            </Form>
            <Button
              onClick={handleGuestLogin}
              className="w-100 mt-2 fw-bold"
              style={{
                backgroundColor: "#c3073f",
                border: "none",
                padding: "10px",
                color: "white",
              }}
            >
              Login as Guest
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
