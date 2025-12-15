const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Shelly MicroService',
        description: 'The following routes can be used to create, update and delete a Shelly Device and getting the stats of a plugin (tba)'
    },
    host: 'localhost:8083'
};

const outputFile = './swagger-output.json';
const routes = ['./service.js'];

swaggerAutogen(outputFile, routes, doc);