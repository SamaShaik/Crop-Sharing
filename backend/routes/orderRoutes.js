const express = require("express");

const router = express.Router();

const {

    placeOrder,
    getBuyerOrders,
    getFarmerOrders,
    getOrderById,
    updateOrderStatus

} = require("../controllers/orderController");

router.post("/", placeOrder);

router.get("/buyer/:buyerId", getBuyerOrders);

router.get("/farmer/:farmerId", getFarmerOrders);
router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

module.exports = router;