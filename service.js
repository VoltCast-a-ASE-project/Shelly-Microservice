const express = require('express');
const db = require('./database/database');
const shellyRoutes = require('./VMC/routes/shelly');
const statsRoutes = require('./VMC/routes/stats');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// make server express
const app = express();

// port of the server
const port = 8083;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs/swagger.json', (req,res) => res.json(swaggerDocument));
app.get('/api-docs', swaggerUi.setup(swaggerDocument, { swaggerOptions : { displayRequestDuration : true, url: "/api-docs/swagger-output.json",}, explorer: true, }));


app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Shelly Microservice!' });
});

app.use('/shelly', shellyRoutes);
app.use('/shelly', statsRoutes);

app.listen(port, async () => {
    try {
       await db.testDatabase();
        console.log('Database connection successful.:');

        console.log(`Listening on port ${port}`);
    } catch (err) {
        console.error('Cannot connect to database.:', err.stack);
    }
});