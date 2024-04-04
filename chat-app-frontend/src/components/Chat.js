import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function Chat() {
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasJoined, setHasJoined] = useState(false); // Kullanıcının odaya katılıp katılmadığını takip eden state

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:3000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();

    socket.on('message', (incomingMessage) => {
      setMessages((msgs) => [...msgs, incomingMessage]);
    });
  }, []);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit('joinRoom', { room });
      setHasJoined(true); // Kullanıcı odaya katıldığında bu değeri true olarak ayarla
    }
  };

  const sendMessage = (e) => {
    e.preventDefault(); // Form submit işlemi sayfa yenilenmesini tetiklemesin diye
    if (message !== "") {
      socket.emit('chatMessage', { room, message });
      setMessage('');
    }
  };

  return (
    <div>
      <select onChange={(e) => setRoom(e.target.value)} value={room}>
        <option value="">Select a Room</option>
        {rooms.map((r, index) => (
          <option key={index} value={r.name}>{r.name}</option>
        ))}
      </select>
      <button onClick={joinRoom}>Join Room</button>

      {/* Kullanıcı bir odaya katıldıysa mesaj gönderme alanını göster */}
      {hasJoined && (
        <div>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send Message</button>
          </form>
          
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
