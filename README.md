# Shelly Microservice
The Shelly Microservice provides an integration for Shelly devices including switching them on/off, configuring them and showing stats, such as consumption or generated energy, of the plugged in devices.
To gather all the necessary information, the IP-address of the device is needed. The information for every Shelly is then stored in a SQLLite Database to provide historical data.

A Shelly is designed for smart homes for power conservation and automation. The API used for the Shelly plugin can be found here: https://shelly-api-docs.shelly.cloud/gen2/Devices/Gen3/ShellyAZPlug/.

## Setup
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

### Test the Service
```bash
npm test -- --coverage
```

## Endpoints

### Hello Route
This route helps to check if the Service works:
- Endpoint: ```GET /hello ```

### Shelly Management
- Add Shelly
  - Endpoint: ```POST /shelly/ add```
  - Body: 
```
{
  "id": "ShellyID",
  "ip": "IPv4 Address",
  "name": "ShellyName",
  "user": "userID",
  "internal_id" : "internal ShellyID",
  "isActivated": true  
}
```
- Update Shelly
  - Endpoint: ```POST /shelly/ update```
  - Body:
```
{
  "id": "ShellyID",
  "ip": "IPv4 Address",
  "name": "ShellyName",
  "user": "userID",
  "internal_id" : "internal ShellyID",
  "isActivated": true  
}
```
- Get Shelly
  - Endpoint: ```GET /shelly/{id}```
  - Returns:
```
{
  "id": "ShellyID",
  "ip": "IPv4 Address",
  "name": "ShellyName",
  "user": "userID",
  "internal_id" : "internal ShellyID",
  "isActivated": true  
}
```
- Delete Shelly
  - Endpoint: ```DELETE /shelly/{id}```

### Shelly Stats
tba...