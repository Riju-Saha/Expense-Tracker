const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./connection');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Make sure your frontend is running on this port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

// Connect to DB
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

// Root route for testing
app.get('/', (req, res) => {
  res.send("Hello, the server is running!");
});

// Use the routes you have defined
const usersRoutes = require('./pages/api/users');
app.use('/api/users', usersRoutes);

const transactionsRoutes = require('./pages/api/transactions');
app.use('/api/transactions', transactionsRoutes);

// Catch all other routes and return 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
