// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// In-memory "database"
let users = []; // { id, name, email, password }

// -----------------------------
// Register route
// -----------------------------
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // Check if email already exists
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

// -----------------------------
// Login route
// -----------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// -----------------------------
// Middleware to protect routes
// -----------------------------
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = users.find(u => u.id === decoded.id);
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// -----------------------------
// Get current logged-in user profile
// -----------------------------
router.get('/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

module.exports = router;
