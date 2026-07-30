const Order = require("../models/orderModel");

const placeOrder = async (req, res) => {

    try {

        const {

            buyer_id,
            crop_id,
            farmer_id,
            quantity,
            crop_price,
            transport_cost,
            total_amount,
            destination_address,
            destination_lat,
            destination_lon,
            transport_type

        } = req.body;

        const result = await Order.createOrder({

            buyer_id,
            crop_id,
            farmer_id,
            quantity,
            crop_price,
            transport_cost,
            total_amount,
            destination_address,
            destination_lat,
            destination_lon,
            transport_type

        });

        res.status(201).json({

            message: "Order placed successfully",
            orderId: result.insertId

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to place order"

        });

    }

};

const getBuyerOrders = async (req, res) => {

    try {

        const orders = await Order.getBuyerOrders(req.params.buyerId);

        res.json(orders);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to fetch orders"

        });

    }

};
const getFarmerOrders = async (req, res) => {

    try {

        const orders = await Order.getFarmerOrders(req.params.farmerId);

        res.json(orders);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to fetch farmer orders"

        });

    }

};
const getOrderById = async (req, res) => {

    try {

        const order = await Order.getOrderDetails(req.params.id);

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json(order);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch order"
        });

    }

};
const updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "Accepted",
            "Rejected",
            "In Transit",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status."
            });
        }

        if (status === "Accepted") {

            const order = await Order.getOrderById(req.params.id);

            const Crop = require("../models/Crop");
            const crop = await Crop.getCropById(order.crop_id);

            if (!crop) {

                return res.status(404).json({
                    message: "Crop not found"
                });

            }

            const remainingQuantity =
                Number(crop.quantity) - Number(order.quantity);
            

            await Order.updateCropQuantity(
                order.crop_id,
                remainingQuantity
            );

        }

        await Order.updateOrderStatus(
            req.params.id,
            status
        );

        res.json({
            message: "Order status updated successfully"
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to update order status"
        });

    }

};

module.exports = {

    placeOrder,
    getBuyerOrders,
    getFarmerOrders,
    getOrderById,
    updateOrderStatus

};