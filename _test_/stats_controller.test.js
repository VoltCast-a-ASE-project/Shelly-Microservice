const StatsController = require('../VMC/controllers/stats');
const Stats = require('../VMC/models/stats');

jest.mock('../VMC/models/stats');
jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));

describe('StatsController', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getShellyStats', () => {
        it('returns 400 if no id is provided', async () => {
        await StatsController.getShellyStats(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({message: 'ID for ShellyDevice is required.'});
        });

        it('returns 404 if no shelly device is found', async () => {
            req.params.id = '123';
            Stats.getShellyStats.mockResolvedValue(null);

            await StatsController.getShellyStats(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 200 and stats on success', async () => {
            req.params.id = '123';
            const mockStats = { isActivated: true, apower: 50 };
            Stats.getShellyStats.mockResolvedValue(mockStats);

            await StatsController.getShellyStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStats);
        });

        it('returns 500 on error', async () => {
            req.params.id = '123';
            Stats.getShellyStats.mockRejectedValue(new Error('fail'));

            await StatsController.getShellyStats(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('setShellyIsActivatedStatus', () => {
        it('returns 200 if switch was successful', async () => {
            req.params.id = '123';
            req.body.isActivated = true;
            Stats.setSwitchById.mockResolvedValue(true);

            await StatsController.setShellyIsActivatedStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 if shelly not found', async () => {
            req.params.id = '123';
            req.body.isActivated = false;
            Stats.setSwitchById.mockResolvedValue(false);

            await StatsController.setShellyIsActivatedStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 500 on error', async () => {
            req.params.id = '123';
            req.body.isActivated = true;
            Stats.setSwitchById.mockRejectedValue(new Error('fail'));

            await StatsController.setShellyIsActivatedStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
