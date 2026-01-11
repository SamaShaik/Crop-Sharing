const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("🔑 Incoming Authorization Header:", authHeader); 

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 
  console.log("Extracted Token:", token); 

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log("JWT verified:", decoded); 
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };


