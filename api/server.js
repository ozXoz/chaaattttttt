const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const chatRoutes = require("./routes/chatRoutes"); // Mesajlaşma için API rotaları
const roomRoutes = require("./routes/roomRoutes"); // Oda yönetimi için API rotaları
const authRoutes = require("./routes/auth"); // Kullanıcı kimlik doğrulama için API rotaları
const userRoutes = require("./routes/userRoutes"); // Kullanıcı yönetimi için API rotaları
const Message = require("./models/Message"); // Mesaj modelini import edin

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Geliştirme aşamasında tüm kaynaklardan isteklere izin veriliyor
    methods: ["GET", "POST"],
  },
});

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Static Welcome Route
app.get("/", (req, res) => {
  res.send("Hello, Hotel Booking System!");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/admin", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rooms", roomRoutes);

// Socket.IO for Real-Time Communication
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a chat room
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`A user joined room: ${room}`);
    // Broadcast to the room (except the user joining)
    socket.broadcast.to(room).emit("message", "A new user has joined the room");
  });

  // Handle chat message
  socket.on("chatMessage", ({ room, message }) => {
    // Emit message to everyone in the room
    io.to(room).emit("message", message);
  });

  // Leave the room
  socket.on("disconnect", () => {
    console.log("User disconnected");
    // You might also handle user leaving a room here
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
