const request = require('supertest');
const express = require('express');
const statsRouter = require('../VMC/routes/stats');
const Stats = require('../VMC/models/stats');

jest.mock('../VMC/models/stats');

const app = express();
app.use(express.json());
app.use('/', statsRouter);

describe('StatsController + Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /stats/:id', () => {

        it('returns 200 with stats object', async () => {
            Stats.getShellyStats.mockResolvedValue({ id: 1, isActivated: true, apower: 50 });

            const res = await request(app).get('/stats/1');
            expect(res.status).toBe(200);
            expect(res.body.isActivated).toBe(true);
        });

        it('returns 404 if stats not found', async () => {
            Stats.getShellyStats.mockResolvedValue(null);

            const res = await request(app).get('/stats/999');
            expect(res.status).toBe(404);
        });

        it('returns 400 if no id provided', async () => {
            const res = await request(app).get('/stats/');
            expect(res.status).toBe(404);
        });

        it('returns 500 on controller error', async () => {
            Stats.getShellyStats.mockRejectedValue(new Error('fail'));

            const res = await request(app).get('/stats/1');
            expect(res.status).toBe(500);
        });
    });

    describe('POST /switch/:id', () => {

        it('successfully updates switch', async () => {
            Stats.setSwitchById.mockResolvedValue(true);

            const res = await request(app)
                .post('/switch/1')
                .send({ isActivated: true });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Shelly switch updated successfully.');
        });

        it('returns 404 if switch update fails', async () => {
            Stats.setSwitchById.mockResolvedValue(false);

            const res = await request(app)
                .post('/switch/1')
                .send({ isActivated: true });

            expect(res.status).toBe(404);
        });

        it('returns 400 on validation error', async () => {
            const res = await request(app)
                .post('/switch/1')
                .send({ isActivated: 'notBoolean' });

            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('returns 500 on controller error', async () => {
            Stats.setSwitchById.mockRejectedValue(new Error('fail'));

            const res = await request(app)
                .post('/switch/1')
                .send({ isActivated: true });

            expect(res.status).toBe(500);
        });
    });
});
