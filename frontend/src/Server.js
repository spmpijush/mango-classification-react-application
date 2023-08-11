const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mango_price_dataset',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Endpoint
app.post('/api/mango', (req, res) => {
    const { mango_name, district, date, price } = req.body;

    const query = `INSERT INTO tbl_mango_price (mango_name, district, date, price) VALUES (?, ?, ?, ?)`;
    const values = [mango_name, district, date, price];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Failed to insert data into the database' });
        } else {
            res.status(200).json({ message: 'Data inserted successfully' });
        }
    });
});

// GET API Endpoint
app.get('/api/mango', (req, res) => {
    const query = 'SELECT * FROM tbl_mango_price';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Failed to retrieve data from the database' });
        } else {
            res.status(200).json(results);
        }
    });
});

// DELETE API Endpoint
app.delete('/api/mango/:id', (req, res) => {
    const mangoId = req.params.id;

    const query = 'DELETE FROM tbl_mango_price WHERE id = ?';
    const values = [mangoId];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error deleting data:', error);
            res.status(500).json({ error: 'Failed to delete data from the database' });
        } else {
            res.status(200).json({ message: 'Data deleted successfully' });
        }
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
