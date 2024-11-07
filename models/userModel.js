const pool = require('./db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async createUser(fullName, email, password) {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [fullName, email, password]
    );
    return result.insertId;
  },

  async getAllUsersExcept(userId) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email FROM users WHERE id != ?',
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = User;
