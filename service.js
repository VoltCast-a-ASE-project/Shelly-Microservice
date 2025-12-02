const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// make server express
const app = express();

// port of the server
const port = 8083;

app.use(express.json());

// checks for specific methods, headers and a certain origin
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  //credentials: true
}));


app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Shelly Microservice!' });
});

app.listen(port, async () => {
    try {
        //simple call to check database connection
        const res = await db.query('SELECT NOW()');
        console.log('Database connection successful.:', res.rows[0]);

        console.log(`Listening on port ${port}`);
    } catch (err) {
        console.error('Cannot connect to database.:', err.stack);
    }
});