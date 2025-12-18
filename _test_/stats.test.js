const ShellyStats = require('../VMC/models/stats');
const ShellyDevice = require('../VMC/models/shelly');
const ShellyApi = require('../VMC/models/shelly_api');

jest.mock('../VMC/models/shelly');
jest.mock('../VMC/models/shelly_api');
jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));

describe('ShellyStats Model', () => {
  describe('getShellyStats', () => {
    it('returns null if shelly device does not exist', async () => {
      ShellyDevice.getShellyDeviceByID.mockResolvedValue(null);

      const result = await ShellyStats.getShellyStats('123');

      expect(result).toBe(false);
    });

    it('returns ShellyStats instance on success', async () => {
      ShellyDevice.getShellyDeviceByID.mockResolvedValue({
        id: 1,
        ip: '192.168.0.10',
        internal_id: 0
      });

      ShellyApi.getSwitchStatus.mockResolvedValue({
        output: true,
        apower: 100,
        voltage: 230,
        freq: 50,
        current: 0.5,
        aenergy: { total: 2 },
        ret_aenergy: { total: 0.2 },
        temperature: { tC: 30 }
      });

      const result = await ShellyStats.getShellyStats('123');

      expect(result).toBeInstanceOf(ShellyStats);
      expect(result.isActivated).toBe(true);
    });
  });

  describe('setSwitchById', () => {
    it('returns false if shelly not found', async () => {
      ShellyDevice.getShellyDeviceByID.mockResolvedValue(null);

      const result = await ShellyStats.setSwitchById('123', true);

      expect(result).toBe(false);
    });

    it('updates shelly activation status on success', async () => {
      ShellyDevice.getShellyDeviceByID.mockResolvedValue({
        ip: '192.168.0.10',
        internal_id: 0
      });
      ShellyApi.setSwitch.mockResolvedValue(true);
      ShellyDevice.updateShellyDeviceActivationStatus = jest.fn();

      const result = await ShellyStats.setSwitchById('123', true);

      expect(result).toBe(true);
      expect(ShellyDevice.updateShellyDeviceActivationStatus).toHaveBeenCalled();
    });
  });
});
