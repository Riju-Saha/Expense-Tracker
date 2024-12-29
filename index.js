const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./connection');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

const users = require('./pages/api/users'); // Import routes

// Connect to DB
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database');
    return;
  }
  console.log('Connected to the database');
});

// Root route
app.get('/', (req, res) => {
  res.send("Hello");
});

// Use users route
app.use('/api/users', users);

// Start the server
app.listen(8000, () => {
  console.log('Server running on port 8000');
});
