const db = require("../config/db");

const Crop = {

    // Add new crop
    create: (data, callback) => {

        console.log("Crop Data:", data);

        const cropSql = `
            INSERT INTO crops
            (
                farmer_id,
                crop_name,
                quantity,
                price,
                details,
                state,
                source_city,
                farm_address,
                latitude,
                longitude,
                image,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        console.log("SQL:");
        console.log(cropSql);

        console.log("VALUES:");
        console.log([
            data.farmer_id,
            data.crop_name,
            data.quantity,
            data.price,
            data.details,
            data.state,
            data.source_city || null,
            data.farm_address,
            data.latitude,
            data.longitude,
            data.image
        ]);

        db.query(
            cropSql,
            [
                data.farmer_id,
                data.crop_name,
                data.quantity,
                data.price,
                data.details,
                data.state,
                data.source_city || null,
                data.farm_address,
                data.latitude,
                data.longitude,
                data.image
            ],
            (err, result) => {

                if (err) {
                    return callback(err);
                }

                const cropId = result.insertId;

                // No transport selected
                if (!data.transport || data.transport.length === 0) {
                    return callback(null, result);
                }

                const transportArray = Array.isArray(data.transport)
                    ? data.transport
                    : [data.transport];

                const transportValues = transportArray.map(vehicle => [
                    cropId,
                    vehicle
                ]);

                const transportSql = `
                    INSERT INTO crop_transport
                    (
                        crop_id,
                        vehicle_name
                    )
                    VALUES ?
                `;

                db.query(
                    transportSql,
                    [transportValues],
                    (err2) => {

                        if (err2) {
                            return callback(err2);
                        }

                        callback(null, result);

                    }
                );

            }
        );

    },

    // Get all crops
    getAll: (callback) => {

        const sql = `
            SELECT
                c.*,
                u.name AS farmer_name,
                u.country,
                u.state AS farmer_state,
                u.village,
                GROUP_CONCAT(ct.vehicle_name) AS transport
            FROM crops c
            JOIN users u
                ON c.farmer_id = u.id
            LEFT JOIN crop_transport ct
                ON c.id = ct.crop_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `;

        db.query(sql, callback);

    },

    // Get crop by id
    getById: (cropId, callback) => {

        const sql = `
            SELECT
                c.*,
                u.name AS farmer_name,
                u.phone,
                u.country,
                u.state AS farmer_state,
                u.village,
                GROUP_CONCAT(ct.vehicle_name) AS transport

            FROM crops c

            JOIN users u
                ON c.farmer_id = u.id

            LEFT JOIN crop_transport ct
                ON c.id = ct.crop_id

            WHERE c.id = ?

            GROUP BY c.id
        `;

        db.query(sql, [cropId], callback);

    },
    getCropById: (cropId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM crops
            WHERE id = ?
        `;

        db.query(sql, [cropId], (err, result) => {

            if (err)
                return reject(err);

            resolve(result[0]);

        });

    });

},
    // Farmer crops
    getByFarmer: (farmerId, callback) => {

        const sql = `
            SELECT *
            FROM crops
            WHERE farmer_id = ?
            ORDER BY created_at DESC
        `;

        db.query(sql, [farmerId], callback);

    },

    // Delete crop
    delete: (cropId, callback) => {

        const sql = `
            DELETE FROM crops
            WHERE id = ?
        `;

        db.query(sql, [cropId], callback);

    }

};

module.exports = Crop;