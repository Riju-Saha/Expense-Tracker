const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'expense_tracker_db'
});

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database');
//         return;
//     }
//     console.log('Connected to the database');
// });

module.exports = connection;