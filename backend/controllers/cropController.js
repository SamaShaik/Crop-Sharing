
const Crop = require('../models/Crop');

exports.addCrop = (req, res) => {

    console.log("BODY:", req.body);
    const transport = Array.isArray(req.body.transport)
      ? req.body.transport
      : [req.body.transport];
      const cropData = {

        farmer_id: req.user.id,

        crop_name: req.body.crop_name,

        quantity: req.body.quantity,

        price: req.body.price,

        details: req.body.details,

        state: req.body.state,

        source_city: req.body.source_city || null,

        farm_address: req.body.farm_address,

        latitude: req.body.latitude,

        longitude: req.body.longitude,

        transport: transport,

        image: req.file
            ? `uploads/crops/${req.file.filename}`
            : null

    };

    console.log("CropData:", cropData);

    Crop.create(cropData, (err, result) => {

        if (err) {
            console.error("ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("Crop inserted successfully");

        res.json({ message: "Crop added successfully" });

    });

};

exports.getAllCrops = (req, res) => {
  Crop.getAll((err, result) => {
    if (err) {
      console.error("DB Error in getAllCrops:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json(result);  
  });
};

exports.getCropById = (req, res) => {
    console.log("getCropById called with ID:", req.params.id);

    Crop.getById(req.params.id, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Crop not found"
            });
        }

        res.json(result[0]);

    });

};

exports.getFarmerCrops = (req, res) => {
  Crop.getByFarmer(req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.deleteCrop = (req, res) => {
  Crop.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Crop deleted' });
  });
};
