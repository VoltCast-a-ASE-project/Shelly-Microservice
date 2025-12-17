const ShellyDevice = require('../models/shelly');
const ShellyApi = require('../models/shellyApi');

module.exports = class ShellyStats {
    constructor(data) {
        this.id = data.id || null;
        this.shellyID = data.shellyID;
        this.isActivated = data.isActivated;
        this.apower = data.apower;
        this.voltage = data.voltage;
        this.frequency = data.frequency;
        this.current = data.current;
        this.aenergy = data.aenergy;
        this.ret_aenergy = data.ret_aenergy;
        this.temperature = data.temperature;
    }

    /**
        calls the Shelly to get the current status of the device and returns a JSONObject with the retrieved information
    */
    static async getShellyStats(id) {
        try {
            const shelly = await ShellyDevice.getShellyDeviceByID(id);

            if (!shelly) return false;

            const responseJson = await ShellyApi.getSwitchStatus(
                shelly.ip,
                shelly.internal_id
            );

            if (!responseJson) return null;

            return new ShellyStats({
                id: shelly.id,
                shellyID: id,
                isActivated: responseJson.output,
                apower: responseJson.apower,
                voltage: responseJson.voltage,
                frequency: responseJson.freq,
                current: responseJson.current,
                aenergy: responseJson.aenergy.total,
                ret_aenergy: responseJson.ret_aenergy.total,
                temperature: responseJson.temperature.tC,
            });
        } catch (error) {
            console.error('getShellyStats failed:', error.message);
            throw error;
        }
    }

    /**
        switches the Shelly on and off with a request to the device
    */
    static async setActivationStatusForShelly(ip, id,status) {
        return ShellyApi.setSwitch(ip, id, status);
    }

    /**
        handles the switching on and off for a shelly device
    */
    static async setSwitchById(id, switchStatus) {
        try {
            // get Shelly from DB to retrieve IP and internal_ip of Shelly within the network
            const shelly = await ShellyDevice.getShellyDeviceByID(id);
            if (!shelly) return false;

            // sets the status of the Shelly with a request to the device
            const result = await this.setActivationStatusForShelly(shelly.ip, shelly.internal_id, switchStatus);
            if (result) {
                //update the status in the DB if successful
                await ShellyDevice.updateShellyDeviceActivationStatus({ id, isActivated: switchStatus });
            }

            return result;
        } catch (error) {
            console.error("Error in setSwitchById:", error.message);
            return false;
        }
    }
}

