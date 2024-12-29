const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../../connection');
const app = express();

// Middleware
app.use(bodyParser.json());

// Route to register user
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    let sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
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
app.post('/login', (req, res) => {
    const { name, password } = req.body;
    let sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
    const values = [name, password];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0].id });
        } else {
            res.status(401).json({ error: 'Invalid name or password' });
        }
    });
});


module.exports = app;
