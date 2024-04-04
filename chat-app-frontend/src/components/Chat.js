import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom"; // useParams import edilir
import styles from "../css/Chat.module.css";

// Assuming your Socket.IO server is running on localhost:3000
const socket = io.connect("http://localhost:3000");

function Chat() {
  const { roomName } = useParams(); // URL'den oda ismini alır
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomName) {
      // Oda ismi varsa, odaya katıl
      socket.emit("joinRoom", { room: roomName });
    }

    // Mesajları dinle
    socket.on("message", (incomingMessage) => {
      setMessages((msgs) => [...msgs, incomingMessage]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("message");
    };
  }, [roomName]); // roomName değişikliğinde useEffect'i tetikle

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      // Mesajı gönder
      socket.emit("chatMessage", { room: roomName, message });
      setMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Room: {roomName}</h2> {/* Oda ismini başlık olarak göster */}
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
          <div key={index} className={styles.messageItem}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
