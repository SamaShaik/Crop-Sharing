const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/farmer/:id", (req, res) => {
  const farmerId = req.params.id;

  const sql = `
    SELECT name, country, state, phone
    FROM users
    WHERE id = ? AND role = 'farmer'
  `;

  db.query(sql, [farmerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
