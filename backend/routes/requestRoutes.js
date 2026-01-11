const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const requestController = require('../controllers/requestController');

router.get(
  '/farmer/:farmerId',
  verifyToken,
  requestController.getFarmerRequests
);
router.put(
  '/:id/status',
  verifyToken,
  requestController.updateRequestStatus
);

router.get('/:buyerId', requestController.getBuyerRequests);
router.post('/add', verifyToken, requestController.addRequest);
router.delete('/:id', requestController.deleteRequest);


module.exports = router;
