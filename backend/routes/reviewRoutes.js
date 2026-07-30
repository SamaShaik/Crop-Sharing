const express = require("express");

const router = express.Router();

const {

    addReview,
    getFarmerReviews,
    getCropReviews,
    getOrderReview

} = require("../controllers/reviewController");

router.post("/", addReview);

router.get("/farmer/:farmerId", getFarmerReviews);

router.get("/crop/:farmerId/:cropName", getCropReviews);

router.get("/order/:orderId", getOrderReview);

module.exports = router;