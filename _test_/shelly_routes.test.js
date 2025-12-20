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


describe('ShellyController + Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /shelly/:id', () => {

        it('returns 200 with device', async () => {
            db.query.mockResolvedValue({
                rows: [{ id: 1, ip:'1', name:'A', user:'u', internal_id:0, isActivated:0 }]
            });

            const res = await request(app).get('/shelly/1');
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('A');
        });

        it('returns 404 if device not found', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const res = await request(app).get('/shelly/999');
            expect(res.status).toBe(404);
        });

        it('returns 500 on db error', async () => {
            db.query.mockRejectedValue(new Error('fail'));

            const res = await request(app).get('/shelly/1');
            expect(res.status).toBe(500);
        });
    });

    describe('GET /shelly/user/:user', () => {

        it('returns array of devices', async () => {
            db.query.mockResolvedValue({
                rows: [
                    { id:1, ip:'1', name:'A', user:'u', internal_id:0, isActivated:0 },
                    { id:2, ip:'2', name:'B', user:'u', internal_id:1, isActivated:1 }
                ]
            });

            const res = await request(app).get('/shelly/user/u');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });

        it('returns empty array if no devices', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const res = await request(app).get('/shelly/user/unknown');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('returns 500 on db error', async () => {
            db.query.mockRejectedValue(new Error('fail'));

            const res = await request(app).get('/shelly/user/u');
            expect(res.status).toBe(500);
        });
    });

    describe('POST /shelly/', () => {

        it('successfully adds device', async () => {
            db.query.mockResolvedValue({ lastID: 1 });

            const res = await request(app)
                .post('/shelly/')
                .send({ ip:'1', name:'A', user:'u', internal_id:0 });

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.message).toBe('Added ShellyDevice successfully.');
        });

        it('returns 400 on validation error', async () => {
            const res = await request(app)
                .post('/shelly/')
                .send({ ip:'', name:'', user:'', internal_id:'abc' });

            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('returns 500 on db error', async () => {
            db.query.mockRejectedValue(new Error('fail'));

            const res = await request(app)
                .post('/shelly/')
                .send({ ip:'1', name:'A', user:'u', internal_id:0 });

            expect(res.status).toBe(500);
        });
    });

    describe('PUT /shelly/', () => {

        it('successfully updates device', async () => {
            db.query.mockResolvedValue({ changes: 1 });

            const res = await request(app)
                .put('/shelly/')
                .send({ id:1, ip:'1', name:'A', user:'u', internal_id:0, isActivated:true });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Updated ShellyDevice successfully.');
        });

        it('returns 400 if no changes', async () => {
            db.query.mockResolvedValue({ changes: 0 });

            const res = await request(app)
                .put('/shelly/')
                .send({ id:1, ip:'1', name:'A', user:'u', internal_id:0, isActivated:true });

            expect(res.status).toBe(400);
        });

        it('returns 500 on db error', async () => {
            db.query.mockRejectedValue(new Error('fail'));

            const res = await request(app)
                .put('/shelly/')
                .send({ id:1, ip:'1', name:'A', user:'u', internal_id:0, isActivated:true });

            expect(res.status).toBe(500);
        });

        it('returns 400 on validation error', async () => {
            const res = await request(app)
                .put('/shelly/')
                .send({ id:'abc', ip:'', name:'', user:'', internal_id:'x', isActivated:'y' });

            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('DELETE /shelly/:id', () => {

        it('successfully deletes device', async () => {
            db.query.mockResolvedValue({ changes:1 });

            const res = await request(app).delete('/shelly/1');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('ShellyDevice deleted successfully.');
        });

        it('returns 404 if not found', async () => {
            db.query.mockResolvedValue({ changes:0 });

            const res = await request(app).delete('/shelly/999');
            expect(res.status).toBe(404);
        });

        it('returns 500 on db error', async () => {
            db.query.mockRejectedValue(new Error('fail'));

            const res = await request(app).delete('/shelly/1');
            expect(res.status).toBe(500);
        });
    });
});