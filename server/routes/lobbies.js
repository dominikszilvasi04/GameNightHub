const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lobby = require('../models/Lobby');   
const User = require('../models/User');    
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

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
  const { game, description, maxPlayers, isPrivate, password, imageUrl } = req.body;
  const isPrivateBool = isPrivate === true || isPrivate === 'on';

  try {
    // Generate a unique, 6-character invite code
    let inviteCode = nanoid(6);
    let existingLobby = await Lobby.findOne({ inviteCode });
    // Keep generating a new code until we find one that's not in use
    while (existingLobby) {
      inviteCode = nanoid(6);
      imageUrl,
      existingLobby = await Lobby.findOne({ inviteCode });
    }

    const newLobby = new Lobby({
      game,
      description,
      maxPlayers,
      isPrivate: isPrivateBool,
      creator: req.user.id,
      players: [req.user.id],
      inviteCode, // Add the new code to the lobby object
    });

    if (isPrivateBool && password) {
      const salt = await bcrypt.genSalt(10);
      newLobby.password = await bcrypt.hash(password, salt);
    } else if (isPrivateBool && !password) {
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

// @route   PUT /api/lobbies/:id
// @desc    Update a lobby (e.g., change image URL)
// @access  Private (only for the creator)
router.put('/:id', auth, async (req, res) => {
  const { imageUrl, description, maxPlayers } = req.body;

  try {
    let lobby = await Lobby.findById(req.params.id);

    if (!lobby) {
      return res.status(404).json({ msg: 'Lobby not found' });
    }

    // Authorization check: Make sure the user is the lobby creator
    if (lobby.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update the fields
    if (imageUrl !== undefined) lobby.imageUrl = imageUrl;
    if (description !== undefined) lobby.description = description;
    if (maxPlayers !== undefined) lobby.maxPlayers = maxPlayers;

    await lobby.save();
    
    // Return the fully populated lobby
    await lobby.populate(['creator', 'players'], 'username');
    res.json(lobby);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/lobbies/join
// @desc    Join a private lobby using invite code and password
// @access  Private
router.post('/join', auth, async (req, res) => {
  const { inviteCode, password } = req.body;
  try {
    // Find the lobby by the human-readable invite code
    const lobby = await Lobby.findOne({ inviteCode });
    if (!lobby || !lobby.isPrivate) {
      return res.status(404).json({ msg: 'Private lobby not found with that code' });
    }

    const isMatch = await bcrypt.compare(password, lobby.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    if (lobby.players.some(p => p.equals(req.user.id))) {
      return res.status(400).json({ msg: 'User already in lobby' });
    }
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