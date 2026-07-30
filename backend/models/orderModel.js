const db = require("../config/db");

const createOrder = (orderData) => {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO orders
            (
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
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [

            orderData.buyer_id,
            orderData.crop_id,
            orderData.farmer_id,
            orderData.quantity,
            orderData.crop_price,
            orderData.transport_cost,
            orderData.total_amount,
            orderData.destination_address,
            orderData.destination_lat,
            orderData.destination_lon,
            orderData.transport_type

        ], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};

const getBuyerOrders = (buyerId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                o.*,
                c.crop_name,
                u.name AS farmer_name
            FROM orders o
            JOIN crops c
                ON o.crop_id = c.id
            JOIN users u
                ON o.farmer_id = u.id
            WHERE o.buyer_id = ?
            ORDER BY o.id DESC
        `;

        db.query(sql, [buyerId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};
const getOrderDetails = (orderId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                o.*,
                c.crop_name,
                u.name AS farmer_name
            FROM orders o
            JOIN users u
                ON o.farmer_id = u.id
            LEFT JOIN crops c
                ON o.crop_id = c.id
            WHERE o.id = ?
        `;

        db.query(sql, [orderId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result[0]);

        });

    });

};
const getFarmerOrders = (farmerId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                o.*,
                c.crop_name,
                u.name AS buyer_name
            FROM orders o
            JOIN crops c
                ON o.crop_id = c.id
            JOIN users u
                ON o.buyer_id = u.id
            WHERE o.farmer_id = ?
            ORDER BY o.id DESC
        `;

        db.query(sql, [farmerId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};
const updateOrderStatus = (orderId, status) => {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE orders
            SET order_status = ?
            WHERE id = ?
        `;

        db.query(sql, [status, orderId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};
const getOrderById = (orderId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM orders
            WHERE id = ?
        `;

        db.query(sql, [orderId], (err, result) => {

            if (err) return reject(err);

            resolve(result[0]);

        });

    });

};

const updateCropQuantity = (cropId, quantity) => {

    return new Promise((resolve, reject) => {
        if (quantity <= 0) {

            db.query(
                "UPDATE crops SET quantity = 0 WHERE id = ?",
                [cropId],
                (err, result) => {

                    if (err) return reject(err);

                    resolve(result);

                }
            );

        }
         else {

            db.query(
                "UPDATE crops SET quantity = ? WHERE id = ?",
                [quantity, cropId],
                (err, result) => {

                    if (err) return reject(err);

                    resolve(result);

                }
            );

        }

    });

};
module.exports = {

    createOrder,
    getBuyerOrders,
    getFarmerOrders,
    getOrderDetails,
    updateOrderStatus,
    getOrderById,
    updateCropQuantity

};