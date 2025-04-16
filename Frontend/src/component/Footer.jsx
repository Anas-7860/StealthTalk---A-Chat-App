import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      className="mt-auto py-3"
      style={{
        backgroundColor: "#0b0c10",
        color: "#ffffffcc",
        borderTop: "1px solid #66fcf1",
        fontSize: "14px",
      }}
    >
      <Container fluid className="text-center">
        <Row>
          <Col>
            <p className="mb-1">
              &copy; {new Date().getFullYear()} <strong>StealthTalk</strong> &mdash; Built with 💙 for private conversations.
            </p>
            <p style={{ fontSize: "12px", color: "#888" }}>
              Made By{" "}
              <a
                href="https://www.linkedin.com/in/anas-khan-b6722424b/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#66fcf1" }}
              >
                Anas Khan
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
