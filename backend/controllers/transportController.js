const axios = require("axios");
const db = require("../config/db");

exports.calculateTransport = async (req, res) => {

    const {

        source_lat,
        source_lon,
        destination_lat,
        destination_lon,
        vehicle

    } = req.body;

    try {

        const osrmUrl =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${source_lon},${source_lat};${destination_lon},${destination_lat}` +
            `?overview=false`;

        const routeResponse = await axios.get(osrmUrl);

        if (
            !routeResponse.data.routes ||
            routeResponse.data.routes.length === 0
        ) {

            return res.status(404).json({

                error: "Route not found"

            });

        }

        const distance =
            routeResponse.data.routes[0].distance / 1000;

        const rateQuery = `
            SELECT
                rate_per_km,
                loading_charge
            FROM transport_rates
            WHERE vehicle_name = ?
        `;

        db.query(

            rateQuery,

            [vehicle],

            (err, result) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({

                        error: "Database Error"

                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({

                        error: "Vehicle not found"

                    });

                }

                const rate =
                    Number(result[0].rate_per_km);

                const loadingCharge =
                    Number(result[0].loading_charge);

                const toll = 0;

                const transportCost =
                    (distance * rate) +
                    loadingCharge +
                    toll;

                res.json({

                    distance: distance.toFixed(2),
                    rate,
                    loadingCharge,
                    toll,
                    transportCost: Number(
                        transportCost.toFixed(2)
                    )

                });

            }

        );

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Unable to calculate transport"

        });

    }

};