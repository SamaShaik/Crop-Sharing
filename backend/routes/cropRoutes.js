const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all crops (public)
router.get('/', cropController.getAllCrops);

// GET crops of logged-in farmer
router.get('/farmer', verifyToken, cropController.getFarmerCrops);

// POST add new crop
router.post('/', verifyToken, cropController.addCrop);

// DELETE crop by ID
router.delete('/:id', verifyToken, cropController.deleteCrop);

module.exports = router;
