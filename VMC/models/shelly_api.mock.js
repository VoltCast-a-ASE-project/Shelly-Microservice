const crypto = require('crypto');
const deviceStates = new Map();

/**
    getState mock method
*/
function getState(key) {
    if (!deviceStates.has(key)) {
        deviceStates.set(key, {
          output: false,
          apower: 0,
          voltage: 230,
          freq: 50,
          current: 0,
          aenergy: { total: 2.35 },
          ret_aenergy: { total: 0.18 },
          temperature: { tC: 34.1 }
        });
    }
    return deviceStates.get(key);
}

/**
    secure random value generation
*/
function secureRandomFloat(min, max) {
    const buf = crypto.randomBytes(4);
    const randomInt = buf.readUInt32BE(0);
    const normalized = randomInt / 0xffffffff;
    return +(min + normalized * (max - min)).toFixed(2);
}

/**
    getSwitchStatus mock method
*/
async function getSwitchStatus(ip, internalId) {
    const state = getState(`${ip}-${internalId}`);
    const { output } = state;

    const voltage = secureRandomFloat(220, 240);
    const freq = secureRandomFloat(49.8, 50.2);

    const apower = output ? secureRandomFloat(0, 120) : 0;
    const current = output ? +(apower / voltage).toFixed(2) : 0;
    const aenergy = output ? { total: secureRandomFloat(0, 10) } : state.aenergy;
    const ret_aenergy = output ? { total: secureRandomFloat(0, 1) } : state.ret_aenergy;

    if (output) {
        state.temperature.tC = secureRandomFloat(20, 60);
    }
    const temperature = state.temperature;

    return {
        output,
        apower,
        voltage,
        freq,
        current,
        aenergy,
        ret_aenergy,
        temperature
    };
}


async function setSwitch(ip, internalId, status) {
    const state = getState(`${ip}-${internalId}`);
    state.output = Boolean(status);
    return true;
}

module.exports = {
    getSwitchStatus,
    setSwitch
};
