import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TypeSpeed Battle API' });
});

// Socket.IO Logic
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGame', ({ username }) => {
    let roomId = findAvailableRoom();
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { players: [], gameStarted: false });
    }
    
    rooms.get(roomId).players.push({ id: socket.id, username, progress: 0 });
    
    if (rooms.get(roomId).players.length === 2) {
      io.to(roomId).emit('gameStart', { players: rooms.get(roomId).players });
      rooms.get(roomId).gameStarted = true;
    }
  });

  socket.on('updateProgress', ({ progress }) => {
    const roomId = findPlayerRoom(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.progress = progress;
        io.to(roomId).emit('progressUpdate', { players: room.players });
      }
    }
  });

  socket.on('disconnect', () => {
    const roomId = findPlayerRoom(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      }
    }
  });
});

function findAvailableRoom() {
  for (const [roomId, room] of rooms.entries()) {
    if (!room.gameStarted && room.players.length < 2) {
      return roomId;
    }
  }
  return `room-${Date.now()}`;
}

function findPlayerRoom(playerId) {
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.some(p => p.id === playerId)) {
      return roomId;
    }
  }
  return null;
}

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});