const request = require('supertest');
const express = require('express');
const router = require('../VMC/routes/stats');
const Stats = require('../VMC/models/stats');

jest.mock('../VMC/models/stats');
jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('Stats Routes', () => {
    it('GET /stats/:id returns 200', async () => {
        Stats.getShellyStats.mockResolvedValue({ isActivated: true });

        const res = await request(app).get('/stats/123');

        expect(res.statusCode).toBe(200);
    });

    it('POST /switch/:id validates body', async () => {
        const res = await request(app)
          .post('/switch/123')
          .send({ isActivated: 'notBoolean' });

        expect(res.statusCode).toBe(400);
    });

    it('POST /switch/:id returns 200 on success', async () => {
        Stats.setSwitchById.mockResolvedValue(true);

        const res = await request(app)
          .post('/switch/123')
          .send({ isActivated: true });

        expect(res.statusCode).toBe(200);
    });
});
