const request = require('supertest');
const express = require('express');
const shellyRouter = require('../VMC/routes/shelly');
const db = require('../database/database');

jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));


const app = express();
app.use(express.json());
app.use('/shelly', shellyRouter);


describe('Shelly Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /shelly/:id', () => {
        it('GET /shelly/:id should return device', async () => {
            db.query.mockResolvedValue({
                rows: [{
                    id: 1,
                    ip: '192.168.1.10',
                    name: 'Shelly Plug A',
                    user: 'testUser',
                    internal_id: 0,
                    isActivated: 0
                }]
            });
            const res = await request(app).get('/shelly/1');
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Shelly Plug A');
        });

        it('GET /shelly/:id not found should return 404', async () => {
            db.query.mockResolvedValue({ rows: [] });
            const res = await request(app).get('/shelly/999');
            expect(res.status).toBe(404);
        });

    });

    describe('POST /shelly/add', () => {
        it('POST /shelly/add should add a device', async () => {
            db.query.mockResolvedValue({ lastID: 1 });
            const res = await request(app)
                .post('/shelly/add')
                .send({
                    ip: '192.168.1.10',
                    name: 'Shelly Plug A',
                    user: 'testUser',
                    internal_id: 0
                });
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.message).toBe('Added ShellyDevice successfully.');
        });

        it('POST /shelly/add should return 400', async () => {
            const res = await request(app)
                .post('/shelly/add')
                .send({ ip: '', name: '', user: '', internal_id: 'abc' });
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

    });

    describe('PUT /shelly/update', () => {
        it('PUT /shelly/update should update device', async () => {
            db.query.mockResolvedValue({ changes: 1 });
            const res = await request(app)
                .put('/shelly/update')
                .send({
                    id: 1,
                    ip: '192.168.1.11',
                    name: 'Shelly Plug B',
                    user: 'testUser2',
                    internal_id: 0,
                    isActivated: true
                });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Updated ShellyDevice successfully.');
        });

        it('PUT /shelly/update with no changes should return 400', async () => {
            db.query.mockResolvedValue({ changes: 0 });
            const res = await request(app)
                .put('/shelly/update')
                .send({
                    id: 1,
                    ip: '192.168.1.11',
                    name: 'Shelly Plug B',
                    user: 'testUser2',
                    internal_id: 0,
                    isActivated: true
                });
            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /shelly/:id', () => {
        it('DELETE /shelly/:id should delete device', async () => {
            db.query.mockResolvedValue({ changes: 1 });
            const res = await request(app).delete('/shelly/1');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('ShellyDevice deleted successfully.');
        });

        it('DELETE /shelly/:id not found should return 404', async () => {
            db.query.mockResolvedValue({ changes: 0 });
            const res = await request(app).delete('/shelly/999');
            expect(res.status).toBe(404);
        });
    });

});