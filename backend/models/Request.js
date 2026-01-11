const db = require('../config/db');

const Request = {
  create: (data, callback) => {
    const { buyer_id, crop_id, quantity, requested_price } = data;
    const sql = `
      INSERT INTO buyer_requests
      (buyer_id, crop_id, quantity, requested_price, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;
    db.query(sql, [buyer_id, crop_id, quantity, requested_price], callback);
  },

  getAllByBuyer: (buyerId, callback) => {
    const sql = `
      SELECT r.id, r.quantity, r.requested_price, r.status,
             c.crop_name, u.name AS farmer_name, u.state
      FROM buyer_requests r
      JOIN crops c ON r.crop_id = c.id
      JOIN users u ON c.farmer_id = u.id
      WHERE r.buyer_id = ?
      ORDER BY r.created_at DESC
    `;
    db.query(sql, [buyerId], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM buyer_requests WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Request;
