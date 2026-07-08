const express = require('express');
const { askAI } = require('../services/ai');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, history, stack } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        error: 'Message cannot be empty',
      });
    }

    const reply = await askAI(message, history || [], stack); 
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat route error:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
    });
  }
});

module.exports = router;
