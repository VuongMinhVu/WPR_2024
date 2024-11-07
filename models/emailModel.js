const pool = require('./db');

const Email = {
  async getReceivedEmails(userId, limit, offset) {
    const [rows] = await pool.query(
      `SELECT e.id, e.subject, e.body, e.created_at, u.full_name AS sender_full_name
       FROM emails e
       JOIN users u ON e.sender_id = u.id
       WHERE e.recipient_id = ? AND e.deleted_for_recipient = FALSE
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  },

  async getSentEmails(userId, limit, offset) {
    const [rows] = await pool.query(
      `SELECT e.id, e.subject, e.body, e.created_at, u.full_name AS recipient_full_name
       FROM emails e
       JOIN users u ON e.recipient_id = u.id
       WHERE e.sender_id = ? AND e.deleted_for_sender = FALSE
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  },

  async sendEmail(senderId, recipientId, subject, body, attachment) {
    console.log("Sending email with values:", { senderId, recipientId, subject, body, attachment });
  
    const [result] = await pool.query(
      `INSERT INTO emails (sender_id, recipient_id, subject, body, attachment) VALUES (?, ?, ?, ?, ?)`,
      [senderId, recipientId, subject || "(no subject)", body || "", attachment]
    );
  
    return result.insertId;
  },

  // get email detail
  async getEmailById(emailId, userId) {
    const [rows] = await pool.query(
      `SELECT e.id, e.subject, e.body, e.attachment, e.created_at, 
              sender.full_name AS sender_full_name, 
              recipient.full_name AS recipient_full_name
       FROM emails e
       JOIN users sender ON e.sender_id = sender.id
       JOIN users recipient ON e.recipient_id = recipient.id
       WHERE e.id = ? AND (e.sender_id = ? OR e.recipient_id = ?)`,
      [emailId, userId, userId]
    );
    return rows[0]; // return first email if null
  },
  async deleteEmail(emailId, userId) {
    // update delete in 1 views of users who delete the email
    const [result] = await pool.query(
      `UPDATE emails 
       SET deleted_for_recipient = CASE WHEN recipient_id = ? THEN TRUE ELSE deleted_for_recipient END,
           deleted_for_sender = CASE WHEN sender_id = ? THEN TRUE ELSE deleted_for_sender END
       WHERE id = ? AND (recipient_id = ? OR sender_id = ?)`,
      [userId, userId, emailId, userId, userId]
    );
    return result;
  }
  
};

module.exports = Email;
