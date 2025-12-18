const ShellyApiMock = require('../VMC/models/shelly_api.mock');

describe('Shelly API Mock', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    it('returns initial state when switch is OFF', async () => {
        const api = require('../VMC/models/shelly_api.mock');

        const state = await api.getSwitchStatus('127.0.0.1', 0);

        expect(state.output).toBe(false);
        expect(state.apower).toBe(0);
        expect(state.current).toBe(0);
        expect(state.voltage).toBe(230);
        expect(state.freq).toBe(50);
        expect(state.temperature.tC).toBeGreaterThan(0);
    });

    it('sets switch to ON and updates state', async () => {
        const api = require('../VMC/models/shelly_api.mock');

        await api.setSwitch('127.0.0.1', 1, true);
        const state = await api.getSwitchStatus('127.0.0.1', 1);

        expect(state.output).toBe(true);
        expect(state.apower).toBeGreaterThanOrEqual(0);
        expect(state.current).toBeGreaterThanOrEqual(0);
    });

    it('keeps state per device (Map persistence)', async () => {
        const api = require('../VMC/models/shelly_api.mock');

        await api.setSwitch('127.0.0.1', 0, true);
        const state1 = await api.getSwitchStatus('127.0.0.1', 0);
        const state2 = await api.getSwitchStatus('127.0.0.1', 0);

        expect(state1.output).toBe(true);
        expect(state2.output).toBe(true);
    });

    it('turns power and current to zero when switch is OFF', async () => {
        const api = require('../VMC/models/shelly_api.mock');

        await api.setSwitch('127.0.0.1', 2, true);
        await api.getSwitchStatus('127.0.0.1', 2);

        await api.setSwitch('127.0.0.1', 2, false);
        const state = await api.getSwitchStatus('127.0.0.1', 2);

        expect(state.output).toBe(false);
        expect(state.apower).toBe(0);
        expect(state.current).toBe(0);
    });
});
