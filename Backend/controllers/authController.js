import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Token generate karne ka helper function
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check karo email pehle se hai ya nahi
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'Email already exists' });

  // Naya user banao
  const user = await User.create({ name, email, password });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Password bhi saath mein lao (select: false tha isliye explicitly likhna pada)
  const user = await User.findOne({ email }).select('+password');

  // User nahi mila ya password galat hai
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// Get current logged in user
export const getMe = async (req, res) => {
  // req.user protect middleware ne set kiya tha
  res.json(req.user);
};