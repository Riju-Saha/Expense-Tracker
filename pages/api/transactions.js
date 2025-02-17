const express = require('express');
const router = express.Router();
const connection = require('../../connection');

// Route to handle inserting transactions
router.post('/', (req, res) => {
  const { user_id, amount, type, title, date, time, status } = req.body;
  console.log("info i recieved in backend");
  console.log(req.body);

  if (!user_id || !amount || !type || !title || !date || !time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Fetch user_name from users table based on user_id
  const getUserSql = 'SELECT name FROM users WHERE id = ?';
  connection.query(getUserSql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user_name = results[0].name;

    const insertSql = `
  INSERT INTO transactions (user_id, user_name, amount, type, title, date, time, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [user_id, user_name, amount, type, title, date, time, status];

    connection.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Error inserting transaction:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(200).json({ message: 'Transaction added successfully' });
    });
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

router.delete('/:transactionId', (req, res) => {
  const { transactionId } = req.params;

  const deleteSql = 'DELETE FROM transactions WHERE id = ?';
  connection.query(deleteSql, [transactionId], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
});

module.exports = router;