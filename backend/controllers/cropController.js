const Crop = require('../models/Crop');

exports.addCrop = (req, res) => {
  const cropData = { ...req.body, farmer_id: req.user.id };
  Crop.create(cropData, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Crop added successfully' });
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
