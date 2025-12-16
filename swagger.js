const swaggerAutogen = require('swagger-autogen')();

// creates html for swagger
const doc = {
    info: {
        title: 'Shelly MicroService',
        description: 'The following routes can be used to create, update and delete a Shelly Device and getting the stats of a plugin (tba)'
    },
    host: 'localhost:8083'
};

//output file for autogen
const outputFile = './swagger-output.json';
//uses the routes defined in service.js
const routes = ['./service.js'];

//call autogen to create routes
swaggerAutogen(outputFile, routes, doc);