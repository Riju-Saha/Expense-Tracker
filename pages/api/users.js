const nodemailer = require('nodemailer');
const express = require('express');
const connection = require('../../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


const SECRET_KEY = 'rijudona';

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

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' }); //token created for that id
      console.log("from backend token is ", token);
      res.cookie('UserToken', token, {
        httpOnly: true,
        secure: false,
        // sameSite: 'strict'
        sameSite: 'lax'
    });
    console.log("Cookie Set:", token); 
    console.log("id set", user.id); 
      res.json({ message: 'Logged in', token, user: { id: user.id } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

const authenticateUser = (req, res, next) => {
  console.log("Cookies received in request:", req.cookies);

  const token = req.cookies.UserToken;

  if (!token) {
      console.error("No token found in cookies.");
      return res.status(401).json({ error: '' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          console.error("Invalid token:", err);
          return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      console.log("Decoded user from token:", decoded);
      req.user = decoded;
      next();
  });
};

// Route to fetch user details by ID
router.get('/details/:userId', authenticateUser, (req, res) => {
  const { userId } = req.params;
  const authenticatedUserId = parseInt(req.user.id, 10);

  console.log("Requested User ID:", userId, "Authenticated User ID:", authenticatedUserId);

  if (parseInt(userId, 10) !== authenticatedUserId) {
      console.log("Access Denied: User ID mismatch");
      return res.status(403).json({ error: 'Forbidden - Access denied' });
  }

  const sql = 'SELECT id, name FROM users WHERE id = ?';
  connection.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          const { id, name } = results[0];
          res.json({ message: 'User found', user: { id, name } });
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

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' }); //token created for that id
      console.log("from backend token is ", token);
      res.cookie('UserToken', token, {
        httpOnly: true,
        secure: false,
        // sameSite: 'strict'
        sameSite: 'lax'
    });
    console.log("Cookie Set:", token); 
    console.log("id set", user.id); 
      res.json({ message: 'Logged in', token, user: { id: user.id } });

      // res.json({ message: 'Login successful', user: { id: user.id } });
      // please check later on that email if not passed will not create probelm. id is the main thing
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  })
})

router.post('/logout', (req, res) => {
  res.clearCookie('UserToken', { httpOnly: true, secure: false, sameSite: 'Lax' });
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
