const ShellyStats = require('../VMC/models/stats');
const ShellyDevice = require('../VMC/models/shelly');
const ShellyApi = require('../VMC/models/shelly_api');

jest.mock('../VMC/models/shelly');
jest.mock('../VMC/models/shelly_api');
jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));

describe('ShellyStats', () => {
    const dummyShelly = { id: 1, internal_id: 123, ip: '192.168.1.100' };
    const dummyApiResponse = {
       output: true,
       apower: 50,
       voltage: 230,
       freq: 50,
       current: 0.5,
       aenergy: { total: 1000 },
       ret_aenergy: { total: 100 },
       temperature: { tC: 25 }
     };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns ShellyStats object if device exists and fetch ok', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(dummyShelly);
        ShellyApi.getSwitchStatus.mockResolvedValue(dummyApiResponse);

        const result = await ShellyStats.getShellyStats(1);

        expect(result).toBeInstanceOf(ShellyStats);
        expect(result.isActivated).toBe(true);
        expect(result.apower).toBe(50);
    });

    test('returns false if device does not exist', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(null);

        const result = await ShellyStats.getShellyStats(99);
        expect(result).toBe(false);
    });

    test('returns null if fetch response not ok', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(dummyShelly);
        ShellyApi.getSwitchStatus.mockResolvedValue(null);

        const result = await ShellyStats.getShellyStats(1);
        expect(result).toBeNull();
    });

    test('throws error if fetch throws', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(dummyShelly);
        ShellyApi.getSwitchStatus.mockRejectedValue(new Error('api failed'));

        await expect(ShellyStats.getShellyStats(1)).rejects.toThrow('api failed');
    });

    test('returns true if fetch ok', async () => {
        ShellyApi.setSwitch.mockResolvedValue(true);

        const result = await ShellyStats.setActivationStatusForShelly('1.1.1.1', 123, true);

        expect(result).toBe(true);
        expect(ShellyApi.setSwitch).toHaveBeenCalledWith('1.1.1.1', 123, true);
    });

    test('returns false if fetch not ok', async () => {
        ShellyApi.setSwitch.mockResolvedValue(false);

        const result = await ShellyStats.setActivationStatusForShelly('1.1.1.1', 123, true);
        expect(result).toBe(false);
    });

    test('updates switch and calls updateShellyDeviceActivationStatus', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(dummyShelly);
        ShellyDevice.updateShellyDeviceActivationStatus = jest.fn().mockResolvedValue(true);
        ShellyApi.setSwitch.mockResolvedValue(true);

        const result = await ShellyStats.setSwitchById(1, true);

        expect(result).toBe(true);
        expect(ShellyApi.setSwitch).toHaveBeenCalledWith(dummyShelly.ip, dummyShelly.internal_id, true);
        expect(ShellyDevice.updateShellyDeviceActivationStatus).toHaveBeenCalledWith({ id: 1, isActivated: true });
    });

    test('returns false if device does not exist', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(null);

        const result = await ShellyStats.setSwitchById(99, true);
        expect(result).toBe(false);
    });

    test('returns false if setActivationStatusForShelly returns false', async () => {
        ShellyDevice.getShellyDeviceByID.mockResolvedValue(dummyShelly);
        ShellyApi.setSwitch.mockResolvedValue(false);

        const result = await ShellyStats.setSwitchById(1, true);
        expect(result).toBe(false);
        expect(ShellyDevice.updateShellyDeviceActivationStatus).not.toHaveBeenCalled();
    });

    test('returns false if setSwitchById throws', async () => {
        ShellyDevice.getShellyDeviceByID.mockImplementation(() => { throw new Error('db fail'); });

        const result = await ShellyStats.setSwitchById(1, true);
        expect(result).toBe(false);
    });
});
