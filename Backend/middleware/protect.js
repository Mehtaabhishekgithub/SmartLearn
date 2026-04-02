import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const protect = async (req, res, next) => {
  // 1. Token header se nikalo
  const token = req.headers.authorization?.split(' ')[1];

  // 2. Token nahi hai toh rok do
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  // 3. Token verify karo
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. User DB se nikalo aur req mein daal do
  req.user = await User.findById(decoded.id);

  // 5. Agle middleware / controller pe bhejo
  next();
};

export default protect;