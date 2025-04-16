import { Container, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container
        fluid
      className="d-flex justify-content-center align-items-center min-vh-100 "
      style={{
        background: "linear-gradient(135deg, #0b0c10, #1f2833, #45a29e)",
        color: "white",
        padding: "20px",
      }}
    >
      <Card
        style={{ maxWidth: "700px", padding: "30px", backgroundColor: "rgba(20, 20, 20, 0.9)" }}
        className="shadow-lg text-white"
      >
        <h2 className="mb-4 text-center">About StealthTalk</h2>

        <p>
          <strong>StealthTalk</strong> is a secure and anonymous real-time chat platform designed to give users the
          freedom to communicate in public or private rooms without revealing their identity—unless they choose to.
        </p>

        <p>
          Built using the <strong>MERN</strong> stack and <strong>Socket.io</strong> for real-time communication, the
          app offers modern authentication, profile editing, anonymous messaging, and much more.
        </p>

        <p>
          Whether you're here to have deep conversations, connect privately, or just chat anonymously—StealthTalk has
          your back.
        </p>

        <hr className="my-4" />

        <h5 className="mb-3">Credits</h5>
        <ul>
          <li>
            💻 Developed by <strong>Anas Khan</strong>
          </li>
          <li>
            📦 Built using React, Node.js, Express, MongoDB, Bootstrap, and Socket.io
          </li>
          <li>
            🔐 Auth & File Upload with JWT and Multer
          </li>
          {/* <li>
            🧠 Special thanks to <strong>ChatGPT</strong> for support & debugging assistance
          </li> */}
        </ul>
      </Card>
    </Container>
  );
};

export default About;
