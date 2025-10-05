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

router.get('/:id', async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id)
      .populate('creator', 'username') // Get creator's username
      .populate('players', 'username'); // Get all players' usernames

    if (!lobby) {
      return res.status(404).json({ msg: 'Lobby not found' });
    }
    res.json(lobby);
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

// Add these two routes after your POST '/' route

// @route   PUT /api/lobbies/:id/join
// @desc    Join a lobby
// @access  Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) {
      return res.status(404).json({ msg: 'Lobby not found' });
    }

    // Check if user is already in the lobby
    if (lobby.players.some(player => player.equals(req.user.id))) {
      return res.status(400).json({ msg: 'User already in lobby' });
    }

    // Check if lobby is full
    if (lobby.players.length >= lobby.maxPlayers) {
      return res.status(400).json({ msg: 'Lobby is full' });
    }

    lobby.players.push(req.user.id);
    await lobby.save();

    await lobby.populate(['creator', 'players'], 'username');
    res.json(lobby);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/lobbies/:id/leave
// @desc    Leave a lobby
// @access  Private
router.put('/:id/leave', auth, async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) {
      return res.status(404).json({ msg: 'Lobby not found' });
    }

    // Remove user from players array
    lobby.players = lobby.players.filter(player => !player.equals(req.user.id));
    await lobby.save();

    await lobby.populate(['creator', 'players'], 'username');
    res.json(lobby);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;