const express = require('express');
const connection = require('../../connection');
const router = express.Router();

// Route to register user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting into database:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log("User added successfully");
    return res.status(200).json({ message: 'Registration successful' });
  });
});

// Route to login user
router.post('/login', (req, res) => {
  const { name, password } = req.body;
  const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
  const values = [name, password];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ error: 'Invalid name or password' });
    }
  });
});

// Route to fetch user details by ID
router.get('/details/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ message: 'User found', user: results[0] });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

module.exports = router;
