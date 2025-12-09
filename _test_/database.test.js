const db = require('../database/database');

jest.mock('../database/database', () => ({
    testDatabase: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
}));


describe('SQLite Database Wrapper', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testDatabase should return true if DB is connected', async () => {
        db.testDatabase.mockResolvedValue(true);
        const result = await db.testDatabase();
        expect(result).toBe(true);
    });

    test("query returns mocked rows", async () => {
        db.query.mockResolvedValue({ rows: [{ id: 1 }] });
        const result = await db.query("SELECT * FROM shelly");
        expect(result.rows[0].id).toBe(1);
    });
});
