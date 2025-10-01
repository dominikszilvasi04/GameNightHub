
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// test
app.get('/', (req, res) => {
    res.send('Hello gamenighthub server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});