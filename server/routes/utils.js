const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   GET /api/utils/search-images
// @desc    Search for images using Pexels API
// @access  Private
router.get('/search-images', auth, async (req, res) => {
  const { query } = req.query; // e.g., ?query=Catan
  if (!query) {
    return res.status(400).json({ msg: 'Search query is required' });
  }

  try {
    const pexelsRes = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );
    // We only need the image URLs, so we'll map over the results
    const imageUrls = pexelsRes.data.photos.map(photo => photo.src.landscape);
    res.json(imageUrls);

  } catch (err) {
    console.error('Pexels API error:', err.message);
    res.status(500).send('Server error while searching for images');
  }
});

module.exports = router;