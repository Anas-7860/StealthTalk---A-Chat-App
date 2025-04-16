import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import { Navbar, Nav, Offcanvas, Button, Container } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";

const SidebarNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Navbar with Gradient Background */}
      <Navbar
        expand={false}
        className="fixed-top shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1f1f1f, #343a40)",
          padding: "10px 15px",
        }}
      >
        <Container fluid className="d-flex align-items-center">
          {/* Toggle Button on the Left */}
          <Button variant="outline-light" onClick={() => setShow(true)} className="me-3">
            <FaBars size={22} />
          </Button>
          <Navbar.Brand className="text-light fw-bold fst-italic d-flex align-items-center">
  <img
    src="https://static-00.iconduck.com/assets.00/eye-disabled-icon-2048x2048-3jscn0rl.png"
    alt="Shh"
    width="28"
    height="28"
    className="me-2"
  />
  StealthTalk
</Navbar.Brand>

        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        className="text-light"
        style={{
          width: "260px",
          backgroundColor: "black",
        }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-bold">Chat App</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Cream-colored box for routes */}
          <div
            style={{
              backgroundColor: "#FFFDF0", // Creamish color
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
            }}
          >
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-dark fw-semibold">
                🏠 Rooms
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-dark fw-semibold">
                       📖 About
                         </Nav.Link>
              {!user ? (
                <>
                  <Nav.Link as={Link} to="/login" className="text-dark fw-semibold">
                    🔑 Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-dark fw-semibold">
                    📝 Register
                  </Nav.Link>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center text-dark mt-3 mb-3">
                    <FaUserCircle size={30} className="me-2 text-primary" />
                    {/* Clicking on username redirects to profile */}
                    <span
                      className="fw-bold"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => {
                        navigate("/profile");
                        setShow(false); // Close sidebar after clicking
                      }}
                    >
                      {user.username}
                    </span>
                  </div>
                 
                  <Button variant="danger" className="w-100" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </Button>
                </>
              )}
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SidebarNavbar;
