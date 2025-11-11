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
    console.log(`Listening on port ${port}`);
});
