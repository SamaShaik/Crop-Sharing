const db = require("../config/db");

const addReview = (reviewData) => {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO reviews
            (
                order_id,
                crop_id,
                crop_name,
                buyer_id,
                farmer_id,
                rating,
                review
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(

            sql,

            [

                reviewData.order_id,
                reviewData.crop_id,
                reviewData.crop_name,
                reviewData.buyer_id,
                reviewData.farmer_id,
                reviewData.rating,
                reviewData.review

            ],

            (err, result) => {

                if (err)
                    return reject(err);

                resolve(result);

            }

        );

    });

};

const getReviewByOrder = (orderId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM reviews
            WHERE order_id = ?
        `;

        db.query(sql, [orderId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result[0]);

        });

    });

};

const getFarmerReviews = (farmerId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                r.*,
                u.name AS buyer_name
            FROM reviews r
            JOIN users u
                ON r.buyer_id = u.id
            WHERE r.farmer_id = ?
            ORDER BY r.created_at DESC
        `;

        db.query(sql, [farmerId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};
const getCropReviews = (farmerId, cropName) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                r.*,
                u.name AS buyer_name,
                o.quantity
            FROM reviews r
            JOIN users u
                ON r.buyer_id = u.id
            JOIN orders o
                ON r.order_id = o.id
            WHERE r.farmer_id = ?
            AND r.crop_name = ?
            ORDER BY r.created_at DESC
        `;

        db.query(sql, [farmerId, cropName], (err, result) => {

            if (err)
                return reject(err);

            resolve(result);

        });

    });

};
module.exports = {

    addReview,
    getReviewByOrder,
    getFarmerReviews,
    getCropReviews

};