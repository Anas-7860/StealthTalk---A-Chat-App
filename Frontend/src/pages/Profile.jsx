import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Image,
} from "react-bootstrap";
import { FaUserCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import API from "../utils/api";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    if (file) {
      data.append("profilePicture", file); // ✅ correct key name
    }

    try {
      const res = await API.put("/api/users/edit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible!"
      )
    ) {
      try {
        await API.delete("/api/users/delete");
        alert("Account deleted successfully");
        logout();
        navigate("/register");
      } catch (err) {
        console.error(err);
        alert("Failed to delete account");
      }
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  {console.log("Profile Picture Path:", user.profilePicture)}


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
      <h2 className="mb-4">Profile</h2>
      <Card
        className="shadow-lg"
        style={{
          width: "90%",
          maxWidth: "600px",
          backgroundColor: "rgba(25, 25, 25, 0.9)",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
     <Row className="align-items-center">
  <Col xs={4} className="text-center">
    {user.profilePicture ? (
      <Image
      src={`http://localhost:5000/uploads/${user.profilePicture}`}  // ✅ Ensure full backend URL is used
        roundedCircle
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          border: "2px solid #66fcf1",
        }}
      />
    ) : (
      <FaUserCircle size={100} className="text-primary" />
    )}
  </Col>
  <Col xs={8}>
    <h3 className="fw-bold text-white mb-0">{user.username}</h3>
    <p className="text-white mb-1">
      {user.email || "No email provided"}
    </p>
    <p className="text-light">
      <strong>Joined:</strong>{" "}
      {new Date(user.createdAt).toLocaleDateString()}
    </p>
  </Col>
</Row>


        <div className="d-flex justify-content-around mt-4">
          <Button variant="info" onClick={() => setShowEdit(true)}>
            <FaEdit /> Edit Profile
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <FaTrashAlt /> Delete Account
          </Button>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
