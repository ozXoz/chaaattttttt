// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/authMiddleware');

// Bir odadaki tüm mesajları getir
router.get('/messages/:room', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bir odaya yeni mesaj gönder
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { room, username, message } = req.body;
    const newMessage = new Message({ room, username, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
