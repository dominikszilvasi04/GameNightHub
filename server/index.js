require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Define Routes ---
app.use('/api/users', require('./routes/users'));
app.use('/api/lobbies', require('./routes/lobbies'));
// ---------------------

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// -------------------------

app.get('/', (req, res) => {
    res.send('Hello from the GameNightHub server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});