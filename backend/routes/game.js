import express from 'express';
import { generate } from 'random-words';
import User from '../models/User.js';

const router = express.Router();

router.get('/words', (req, res) => {
  try {
    const words = generate({ exactly: 50, maxLength: 8 });
    res.json({ words });
  } catch (error) {
    res.status(500).json({ message: 'Error generating words', error: error.message });
  }
});

router.post('/score', async (req, res) => {
  try {
    const { userId, wpm, accuracy } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (wpm > user.highScore) {
      user.highScore = wpm;
    }
    user.gamesPlayed += 1;
    await user.save();

    res.json({ highScore: user.highScore, gamesPlayed: user.gamesPlayed });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ highScore: -1 })
      .limit(10)
      .select('username highScore gamesPlayed');
    
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

export default router;