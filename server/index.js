require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); 
const { Server } = require('socket.io'); 

const app = express();
const server = http.createServer(app); 
const io = new Server(server, { // Attach socket.io to the server
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Define Routes ---
app.use('/api/users', require('./routes/users'));
app.use('/api/lobbies', require('./routes/lobbies'));

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinLobby', (lobbyId) => {
    socket.join(lobbyId);
    console.log(`User ${socket.id} joined lobby ${lobbyId}`);
  });

  socket.on('sendMessage', ({ lobbyId, message, user }) => {
    // Broadcast the message to everyone in the specific lobby room
    io.to(lobbyId).emit('receiveMessage', {
      text: message,
      user,
      id: Date.now()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});