import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Room.module.css';

function Room() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  const joinRoom = (roomName) => {
    navigate(`/chat/${roomName}`); // Oda ismi ile birlikte /chat sayfasına yönlendir
  };

  return (
    <div className={styles.container}>
      <h2>Odalar</h2>
      <ul className={styles.roomList}>
        {rooms.map((room, index) => (
          <li key={index} onClick={() => joinRoom(room.name)} className={styles.roomItem}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Room;
