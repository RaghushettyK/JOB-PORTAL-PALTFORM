import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      user_type,
      phone,
      location,
      company_name,
      company_description,
      website,
      skills,
      experience_years
    } = req.body;

    if (!email || !password || !full_name || !user_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      full_name,
      user_type,
      phone,
      location,
      company_name,
      company_description,
      website,
      skills: Array.isArray(skills) ? skills : [],
      experience_years,
    });

    const plainUser = user.toJSON();
    const token = generateToken({ id: plainUser.id, email: plainUser.email, user_type: plainUser.user_type });
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: plainUser.id, email: plainUser.email, full_name: plainUser.full_name, user_type: plainUser.user_type }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const plainUser = user.toJSON();
    const token = generateToken({ id: plainUser.id, email: plainUser.email, user_type: plainUser.user_type });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: plainUser.id,
        email: plainUser.email,
        full_name: plainUser.full_name,
        user_type: plainUser.user_type
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;