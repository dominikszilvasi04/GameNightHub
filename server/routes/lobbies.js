const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lobby = require('../models/Lobby');   
const User = require('../models/User');    
const bcrypt = require('bcryptjs'); 

// @route   GET /api/lobbies
// @desc    Get all public lobbies
// @access  Public
router.get('/', auth, async (req, res) => { 
  try {
    const lobbies = await Lobby.find({
      $or: [ // Find lobbies that match one of these conditions
        { isPrivate: false }, // It's a public lobby
        { players: req.user.id } // Or the user is in the players array
      ]
    })
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
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
  // Add password to destructuring
  const { game, description, maxPlayers, isPrivate, password } = req.body;

  try {
    const newLobby = new Lobby({
      game,
      description,
      maxPlayers,
      isPrivate,
      creator: req.user.id,
      players: [req.user.id],
    });

    // If the lobby is private, hash the password before saving
    if (isPrivate && password) {
      const salt = await bcrypt.genSalt(10);
      newLobby.password = await bcrypt.hash(password, salt);
    } else if (isPrivate && !password) {
        return res.status(400).json({ msg: 'Private lobbies require a password.' });
    }

    const lobby = await newLobby.save();
    await lobby.populate('creator', 'username');
    res.json(lobby);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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