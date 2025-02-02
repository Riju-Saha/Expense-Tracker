const nodemailer = require('nodemailer');
const express = require('express');
const connection = require('../../connection');
const router = express.Router();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'o.56.soumyajit@gmail.com',
    pass: 'gfbc qiku urfk ecup',
  },
});

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: 'o.56.soumyajit@gmail.com',  // Sender's email
    to: email,                    // Recipient's email
    subject: 'Your OTP Code',     // Subject of the email
    text: `Your OTP code is: ${otp}`,  // Body of the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Route to register user
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validate phone number length
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
  }

  // Check if the name or email already exists
  const checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
  connection.query(checkQuery, [name, email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      // Check which field is causing the conflict
      const existingFields = results.map((user) => {
        if (user.name === name && user.email === email) return 'name and email';
        if (user.name === name) return 'name';
        if (user.email === email) return 'email';
      });

      // Send an appropriate message based on conflict
      return res
        .status(400)
        .json({ error: `The ${existingFields.join(' and ')} already exists.` });
    }

    // Proceed with inserting the new user
    const insertQuery = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    const values = [name, email, password, phone];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('User added successfully');
      return res.status(200).json({ message: 'Registration successful' });
    });
  });
});

// Route to login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const values = [email, password];
  console.log("i got ", values);

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ message: 'Login successful', user: { email: user.email, id: user.id } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
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

router.post('/userCheck', (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  const values = [email];
  console.log("i got ", values);

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const sqlUpdate = 'UPDATE users SET otp = ? WHERE email = ?';

      connection.query(sqlUpdate, [verificationCode, email], (err, result) => {
        if (err) {
          console.error('Error updating OTP:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }
        sendOtpEmail(email, verificationCode); // Send OTP email
        res.json({ message: 'OTP updated successfully' });
        // Send response after OTP update
      });
    } else {
      res.status(401).json({ error: 'Email does not exist' });
    }
  });
});

router.post('/otpSent', (req, res) => {
  const { email, otp } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND otp = ?';
  const values = [email, otp];
  console.log("verification got ", values);

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const user = results[0];
      res.json({ message: 'Login successful', user: { id: user.id } });
    } else {
      res.status(401).json({ error: 'Invalid name or password' });
    }
  })
})

module.exports = router;
