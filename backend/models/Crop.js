const db = require('../config/db');

const Crop = {
  // Add new crop
  create: (data, callback) => {
    const sql = `INSERT INTO crops (farmer_id, crop_name, quantity, price, details, state, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    db.query(
      sql,
      [data.farmer_id, data.crop_name, data.quantity, data.price, data.details, data.state],
      callback
    );
  },

  // Get all crops with farmer info
  getAll: (callback) => {
    const sql = `
      SELECT c.*, c.id, u.name AS farmer_name, u.state AS farmer_state
      FROM crops c
      JOIN users u ON c.farmer_id = u.id
      ORDER BY c.created_at DESC
    `;
    db.query(sql, callback);
  },

  // Get crops for a specific farmer
  getByFarmer: (farmerId, callback) => {
    const sql = `SELECT * FROM crops WHERE farmer_id = ? ORDER BY created_at DESC`;
    db.query(sql, [farmerId], callback);
  },

  // Delete crop
  delete: (cropId, callback) => {
    const sql = `DELETE FROM crops WHERE id = ?`;
    db.query(sql, [cropId], callback);
  },

};

module.exports = Crop;
