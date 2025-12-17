const ShellyApi = require('../VMC/models/shelly_api');

describe('ShellyApi', () => {
    beforeAll(() => {
        global.fetch = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns JSON if fetch ok', async () => {
        const dummyResponse = { output: true };
        fetch.mockResolvedValue({
            ok: true,
            json: async () => dummyResponse
        });

        const result = await ShellyApi.getSwitchStatus('1.1.1.1', 123);

        expect(fetch).toHaveBeenCalledWith('http://1.1.1.1/rpc/Switch.GetStatus?id=123');
        expect(result).toEqual(dummyResponse);
    });

    test('returns null if fetch not ok', async () => {
        fetch.mockResolvedValue({ ok: false });

        const result = await ShellyApi.getSwitchStatus('1.1.1.1', 123);

        expect(result).toBeNull();
    });

    test('throws if fetch throws', async () => {
        fetch.mockRejectedValue(new Error('network error'));

        await expect(ShellyApi.getSwitchStatus('1.1.1.1', 123)).rejects.toThrow('network error');
    });

    test('returns true if fetch ok', async () => {
        fetch.mockResolvedValue({ ok: true });

        const result = await ShellyApi.setSwitch('1.1.1.1', 123, true);

        expect(fetch).toHaveBeenCalledWith('http://1.1.1.1/rpc/Switch.Set?id=123&on=true');
        expect(result).toBe(true);
    });

    test('returns false if fetch not ok', async () => {
        fetch.mockResolvedValue({ ok: false });

        const result = await ShellyApi.setSwitch('1.1.1.1', 123, true);

        expect(result).toBe(false);
    });

    test('throws if fetch throws', async () => {
        fetch.mockRejectedValue(new Error('network error'));

        await expect(ShellyApi.setSwitch('1.1.1.1', 123, true)).rejects.toThrow('network error');
    });
});
