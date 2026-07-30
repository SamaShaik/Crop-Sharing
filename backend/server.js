
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));


// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend')));
// Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});