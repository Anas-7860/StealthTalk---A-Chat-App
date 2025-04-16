import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import API from "../utils/api";
import { AuthContext } from "../context/authContext.jsx";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [typing, setTyping] = useState(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/api/chats/${roomId}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    socket.emit("join_room", roomId);

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_typing", (data) => setTyping(data));
    socket.on("user_stop_typing", () => setTyping(null));

    return () => {
      socket.emit("leave_room", roomId);
      socket.off("new_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send_message", { roomId, content: message, isAnonymous });
      setMessage("");
      socket.emit("stop_typing", roomId);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", roomId);
  };

  const handleStopTyping = () => {
    socket.emit("stop_typing", roomId);
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/api/chats/message/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete message error:", err);
    }
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
      <h2 className="mb-4">Chat Room</h2>
      <Card
        className="shadow-lg"
        style={{
          width: "90%",
          maxWidth: "1000px",
          backgroundColor: "rgba(25, 25, 25, 0.9)",
          borderRadius: "15px",
          padding: "15px",
        }}
      >
        <div
          style={{
            height: "500px",
            overflowY: "auto",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: "#121212",
          }}
        >
          {messages.length === 0 && (
            <Alert variant="info" className="text-center">
              No messages yet. Start the conversation!
            </Alert>
          )}
          {messages.map((msg) => {
            const isOwnMessage = msg?.sender?.username === user?.username;
            const senderName = msg?.sender?.isAnonymous ? "Anonymous" : msg?.sender?.username || "Unknown";

            return (
              <div
                key={msg._id}
                className={`d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className="p-2 my-1 position-relative"
                  style={{
                    maxWidth: "80%",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    backgroundColor: isOwnMessage ? "#66fcf1" : "#1f2833",
                    color: isOwnMessage ? "#1f2833" : "white",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{senderName}</strong>
                    <small
                      className={isOwnMessage ? "text-dark" : "text-light"}
                      style={{
                        fontSize: "12px",
                        marginLeft: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "No Time"}
                    </small>
                  </div>
                  <div>{msg.content}</div>
                  {isOwnMessage && (
                    <FaTrash
                      onClick={() => deleteMessage(msg._id)}
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#dc3545",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="text-muted mt-2">
              {typing.isAnonymous ? "Anonymous" : typing.username} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {user && (
          <Form onSubmit={sendMessage} className="mt-3">
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onBlur={handleStopTyping}
                placeholder="Type a message..."
                className="border-0 p-2 bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-2 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
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
              Send
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default Chat;
