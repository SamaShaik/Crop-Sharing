const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const sql = `
      INSERT INTO users 
      (name, email, password, phone, role, country, state, village) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userData.name,
      userData.email,
      userData.password,
      userData.phone,
      userData.role,
      userData.country,
      userData.state,
      userData.village
    ];

    db.query(sql, values, callback);
  },

  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], callback);
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = User;
