import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Room() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Odaları sunucudan çekmek için fetchRooms fonksiyonu
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:3000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Yetkilendirme gerekiyorsa
        },
      });
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  const joinRoom = (room) => {
    // Odaya katılma işlemi
    // Örneğin, odanın ismini localStorage'a kaydedebilirsiniz
    localStorage.setItem('currentRoom', room);
    navigate('/chat'); // Chat sayfasına yönlendir
  };

  return (
    <div>
      <h2>Odalar</h2>
      <ul>
        {rooms.map((room, index) => (
          <li key={index} onClick={() => joinRoom(room)} style={{cursor: 'pointer'}}>
            {room.name} {/* Sunucudan dönen odaların yapısına bağlı olarak düzenleyin */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Room;
