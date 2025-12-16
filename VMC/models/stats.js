const ShellyDevice = require('../models/shelly');

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

    static async getShellyStats(id) {
        try {
            const shelly = await ShellyDevice.getShellyDeviceByID(id);
            
            if (!shelly) return false;

            const url = "http://"+shelly.ip+"/rpc/Switch.GetStatus?id="+shelly.internal_id;
            const response = await fetch(url);
            if (!response.ok) {
                return null;
            }

            const responseJson = await response.json();
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
            console.error(error.message);
            throw error;
        }
    }

    static async setActivationStatusForShelly(ip, id,status) {
        const url = "http://"+ip+"/rpc/Switch.Set?id="+id+"&on="+status;
        console.log(url);
        try{
            const response = await fetch(url);
            return response.ok;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    static async setSwitchById(id, switchStatus) {
        try {
            const shelly = await ShellyDevice.getShellyDeviceByID(id);
            if (!shelly) return false;

            const result = await this.setActivationStatusForShelly(shelly.ip, shelly.internal_id, switchStatus);
            if (result) {
                await ShellyDevice.updateShellyDeviceActivationStatus({ id, isActivated: switchStatus });
            }

            return result;
        } catch (error) {
            console.error("Error in setSwitchById:", error.message);
            return false;
        }
    }
}

