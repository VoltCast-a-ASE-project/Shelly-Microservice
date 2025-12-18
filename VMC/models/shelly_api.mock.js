const crypto = require('crypto');
const deviceStates = new Map();

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

function secureRandomFloat(min, max) {
    const buf = crypto.randomBytes(4);
    const randomInt = buf.readUInt32BE(0);
    const normalized = randomInt / 0xffffffff;
    return +(min + normalized * (max - min)).toFixed(2);
}

async function getSwitchStatus(ip, internalId) {
    const state = getState(`${ip}-${internalId}`);

    if (state.output) {
        state.apower = secureRandomFloat(0, 120);
        state.current = +(state.apower / 230).toFixed(2);
        state.temperature.tC += secureRandomFloat(0, 0.1);
        state.aenergy.total += 0.005;
    } else {
        state.apower = 0;
        state.current = 0;
    }

    return state;
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
