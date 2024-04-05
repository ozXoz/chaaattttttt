import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import styles from "../css/Chat.module.css";

const socket = io.connect("http://localhost:3000");

function Chat() {
  const { roomName } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomName) {
      socket.emit("joinRoom", { room: roomName });
    }

    socket.on("message", (incomingMessage) => {
      setMessages((msgs) => [...msgs, incomingMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, [roomName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      // Correctly retrieve the user's ID from local storage
      const userId = localStorage.getItem("userId"); // Getting userId from local storage
      console.log(
        "Retrieving userId from localStorage:",
        localStorage.getItem("userId")
      );

      // Ensure userId is not null or undefined before attempting to send the message
      if (userId) {
        socket.emit("chatMessage", { room: roomName, userId, message });
        setMessage("");
      } else {
        console.error("User ID is missing. Please log in again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Room: {roomName}</h2>
      <form onSubmit={sendMessage} className={styles.sendMessageForm}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div className={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.messageItem}>
            {/* Check if msg.user exists before trying to access msg.user.username */}
            <strong>{msg.user ? msg.user.username : "Unknown"}:</strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
