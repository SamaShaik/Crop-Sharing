const db = require('../config/db');

const addRequest = (req, res) => {
  const buyer_id = req.user.id;
  const { crop_id, quantity, requested_price } = req.body;

  if (!buyer_id || !crop_id || !quantity || !requested_price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO buyer_requests 
    (buyer_id, crop_id, quantity, requested_price, status)
    VALUES (?, ?, ?, ?, 'pending')
  `;

  db.query(sql, [buyer_id, crop_id, quantity, requested_price], (err, result) => {
    if (err) {
      console.error("Error adding request:", err);
      return res.status(500).json({ error: "Server error while adding request" });
    }

    res.status(201).json({
      message: "Request added successfully",
      requestId: result.insertId
    });
  });
};

const getBuyerRequests = (req, res) => {
  const buyerId = req.params.buyerId;

  if (!buyerId) {
    return res.status(400).json({ error: "Buyer ID is required" });
  }

  const sql = `
    SELECT 
      br.id,
      br.quantity,
      br.requested_price,
      br.status,
      c.crop_name,
      c.state,
      c.farmer_id,          
      u.name AS farmer_name
    FROM buyer_requests br
    JOIN crops c ON br.crop_id = c.id
    JOIN users u ON c.farmer_id = u.id
    WHERE br.buyer_id = ?
    ORDER BY br.created_at DESC
  `;

  db.query(sql, [buyerId], (err, results) => {
    if (err) {
      console.error("Error fetching buyer requests:", err);
      return res.status(500).json({ error: "Error fetching buyer requests" });
    }

    res.json(results || []);
  });
};

const deleteRequest = (req, res) => {
  const requestId = req.params.id;

  if (!requestId) {
    return res.status(400).json({ error: "Request ID is required" });
  }

  const sql = `DELETE FROM buyer_requests WHERE id = ?`;

  db.query(sql, [requestId], (err) => {
    if (err) {
      console.error("Error deleting request:", err);
      return res.status(500).json({ error: "Failed to delete request" });
    }

    res.json({ message: "Request deleted successfully" });
  });
};

const getFarmerRequests = (req, res) => {
  const farmerId = req.params.farmerId;

  if (!farmerId) {
    return res.status(400).json({ error: "Farmer ID is required" });
  }

  const sql = `
    SELECT 
      br.id,
      br.quantity,
      br.requested_price,
      br.status,
      br.created_at,
      c.crop_name,
      c.farmer_id,
      u.name AS buyer_name,
      u.country AS buyer_country,
      u.state AS buyer_state,
      u.phone AS buyer_phone
    FROM buyer_requests br
    JOIN crops c ON br.crop_id = c.id
    JOIN users u ON br.buyer_id = u.id
    WHERE c.farmer_id = ?
    ORDER BY br.created_at DESC
  `;

  db.query(sql, [farmerId], (err, results) => {
    if (err) {
      console.error("Error fetching farmer requests:", err);
      return res.status(500).json({ error: "Failed to fetch buyer requests" });
    }

    res.json(results || []);
  });
};

const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const getCropSql = `
    SELECT crop_id 
    FROM buyer_requests 
    WHERE id = ?
  `;

  db.query(getCropSql, [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(500).json({ error: "Request not found" });
    }

    const cropId = rows[0].crop_id;

    const updateSql = `
      UPDATE buyer_requests 
      SET status = ?
      WHERE id = ?
    `;

    db.query(updateSql, [status, id], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update status" });
      }

      if (status === 'accepted') {
        const rejectOthersSql = `
          UPDATE buyer_requests
          SET status = 'rejected'
          WHERE crop_id = ?
            AND id != ?
            AND status = 'pending'
        `;

        db.query(rejectOthersSql, [cropId, id], () => {
          return res.json({ message: "Request accepted. Other requests rejected." });
        });
      } else {
        return res.json({ message: "Request rejected." });
      }
    });
  });
};

module.exports = {
  addRequest,
  getBuyerRequests,
  deleteRequest,
  getFarmerRequests,
  updateRequestStatus
};
