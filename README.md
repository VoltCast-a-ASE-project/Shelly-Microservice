# Shelly Microservice
The Shelly Microservice provides an integration for Shelly devices including switching them on/off, configuring them and showing stats, such as consumption or generated energy, of the plugged in devices.
To gather all the necessary information, the IP-address of the device is needed. The information for every Shelly is then stored in a SQLLite Database to provide historical data.

A Shelly is designed for smart homes for power conservation and automation. The API used for the Shelly plugin can be found here: https://shelly-api-docs.shelly.cloud/gen2/Devices/Gen3/ShellyAZPlug/.

## Docker
Build Docker image:
```bash
docker build --no-cache -t shelly-local .
```

Start Docker container:
```bash
docker run -d -p 8083:8083 --name shelly shelly-local
```

Stop Shelly container:
```bash
docker stop shelly
```

Start Shelly container again:
```bash
docker start -d shelly
```

Remove Shelly container:
```bash
docker rm shelly
```

## Setup - Locally
Follow these steps to set up the Shelly Microservice locally:

### Prerequisites
- Node.js installation (11.6.2)

### Clone the repository
``` bash
git clone 
```
### Install all necessary packages
The installation with npm creates all necessary dependencies and install the required packages to run the application.
```bash
npm install
```

## Run and Test the Service 
To start the Shelly Microservice, the central service .js-file needs to be run. The service then listens on: http://localhost:8083.
### Start the Service
```bash
node service.js
```

### Run the Service with Mock Dara
```bash
MOCK_SHELLY_API=true node service.js
```

### Test the Service
```bash
npm test -- --coverage
```

## Endpoints
To trigger swagger, please run:
```bash
npm run swagger
```
Then start the service.js and the swagger UI can be found at http://localhost:8083/api-docs/