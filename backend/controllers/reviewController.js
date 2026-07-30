const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");

const addReview = async (req, res) => {

    try {

        const {

            order_id,
            crop_id,
            farmer_id,
            buyer_id,
            rating,
            review

        } = req.body;

        if (rating < 1 || rating > 5) {

            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });

        }

        const existing = await Review.getReviewByOrder(order_id);

        if (existing) {

            return res.status(400).json({
                message: "Review already submitted."
            });

        }

        const order = await Order.getOrderDetails(order_id);

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }
        console.log(order);
        await Review.addReview({

            order_id,
            crop_id,
            crop_name: order.crop_name,
            farmer_id,
            buyer_id,
            rating,
            review

        });

        res.status(201).json({
            message: "Review submitted successfully."
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to submit review."
        });

    }

};
const getFarmerReviews = async (req, res) => {

    try {

        const reviews = await Review.getFarmerReviews(
            req.params.farmerId
        );

        res.json(reviews);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch reviews."
        });

    }

};
const getCropReviews = async (req, res) => {

    try {

        const { farmerId, cropName } = req.params;

        const reviews = await Review.getCropReviews(
            farmerId,
            decodeURIComponent(cropName)
        );

        res.json(reviews);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch crop reviews."
        });

    }

};
const getOrderReview = async (req, res) => {

    try {

        const review = await Review.getReviewByOrder(
            req.params.orderId
        );

        res.json(review || null);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch review."
        });

    }

};
module.exports = {

    addReview,
    getFarmerReviews,
    getCropReviews,
    getOrderReview

};