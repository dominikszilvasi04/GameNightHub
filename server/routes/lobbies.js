const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lobby = require('../models/Lobby');   
const User = require('../models/User');     

// @route   GET /api/lobbies
// @desc    Get all public lobbies
// @access  Public
router.get('/', async (req, res) => {
    try {
        const lobbies = await Lobby.find({ isPrivate: false })
            .populate('creator', 'username') // Replace creator's ID with their username
            .sort({ createdAt: -1 }); // Show newest lobbies first
        res.json(lobbies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/lobbies
// @desc    Create a new lobby
// @access  Private 
router.post('/', auth, async (req, res) => {
    const { game, description, maxPlayers, isPrivate } = req.body;

    try {
        const newLobby = new Lobby({
            game,
            description,
            maxPlayers,
            isPrivate,
            creator: req.user.id, // We get this from the auth middleware
            players: [req.user.id] // The creator is the first player
        });

        const lobby = await newLobby.save();
        // We use .populate() here to fetch the creator's username before sending
        await lobby.populate('creator', 'username');
        res.json(lobby);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;