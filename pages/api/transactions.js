const express = require('express');
const router = express.Router();
const connection = require('../../connection');

// Route to handle inserting transactions
router.post('/', (req, res) => {
    const { user_id, user_name, amount, type, title, date, time } = req.body;
  
    const sql = `
      INSERT INTO transactions (user_id, user_name, amount, type, title, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [user_id, user_name, amount, type, title, date, time];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting transaction:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.status(200).json({ message: 'Transaction added successfully' });
    });
  });
  
  // Route to fetch transactions for a user
  router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
  
    const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, time DESC';
    
    connection.query(sql, [user_id], (err, result) => {
      if (err) {
        console.error('Error fetching transactions:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.status(200).json(result);
    });
  });
  

  module.exports = router;