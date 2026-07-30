const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = (req, res) => {
  const { name, email, password, phone, role, country, state, village } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address."
    });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      error: "Phone number must contain exactly 10 digits."
    });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create(
    {
      name,
      email,
      password: hashedPassword,
      phone,          
      role,
      country,
      state,
      village
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Registration failed' });
      }

      res.json({
        message: 'User registered successfully',
        userId: result.insertId
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password, role } = req.body;

  User.findByEmail(email, (err, users) => {
    if (err) {
    console.error("Login DB Error:", err);
    return res.status(500).json({
        error: err.message
    });
}

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.role !== role) {
      return res.status(403).json({
        message: `You are registered as ${user.role}. Please login as ${user.role}.`
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user
    });
  });
};
