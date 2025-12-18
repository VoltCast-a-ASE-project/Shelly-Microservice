/**
    calls the Shelly to get the current status of the device and returns a JSONObject with the retrieved information
*/
async function getSwitchStatus(ip, internalId) {
    const url = "http://"+ip+"/rpc/Switch.GetStatus?id="+internalId;
    const response = await fetch(url);

    if (!response.ok) {
        return null;
    }

    return response.json();
}

/**
     handles the switching on and off for a shelly device
*/
async function setSwitch(ip, internalId, status) {
    const url = "http://"+ip+"/rpc/Switch.Set?id="+internalId+"&on="+status;
    const response = await fetch(url);
    return response.ok;
}

module.exports = {
    getSwitchStatus,
    setSwitch
};
