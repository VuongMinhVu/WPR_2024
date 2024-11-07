const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  await connection.query(`USE ${process.env.DB_NAME}`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(50),
      email VARCHAR(50) UNIQUE,
      password VARCHAR(50)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS emails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT,
      recipient_id INT,
      subject VARCHAR(100),
      body TEXT,
      attachment VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (recipient_id) REFERENCES users(id),
      deleted_for_sender BOOLEAN DEFAULT FALSE,
      deleted_for_recipient BOOLEAN DEFAULT FALSE
    )
  `);

  await connection.query(`
    INSERT INTO users (full_name, email, password) VALUES
    ('User A', 'a@a.com', '123'),
    ('User B', 'b@b.com', 'password1'),
    ('User C', 'c@c.com', 'password2')
  `);

  await connection.query(`
    INSERT INTO emails (sender_id, recipient_id, subject, body) VALUES
    (1, 2, 'Hello B', 'This is an email from A to B'),
    (1, 2, 'How are you B?', 'This is the second email from A to B'),
    (1, 3, 'Hello C', 'This is an email from A to C'),
    (2, 1, 'Reply from B', 'Thanks A!'),
    (2, 1, 'Second reply from B', 'I am good, thanks A!'),
    (2, 3, 'Hello C', 'This is an email from B to C'),
    (3, 1, 'Reply from C', 'Thank A!'),
    (3, 2, 'Reply from C', 'Thank B!'),
    (2, 1, 'Message from B', 'Have a good day'),
    (2, 1, 'Second message from B', 'Can we go out?'),
    (2, 1, 'Third message from B', 'I am free in the afternoon')
  `);

  console.log("Database and tables created, initial data inserted.");
  await connection.end();
}

setupDatabase();
