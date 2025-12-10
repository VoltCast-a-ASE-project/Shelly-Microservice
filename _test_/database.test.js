jest.mock('sqlite3', () => ({
  verbose: () => ({
    Database: jest.fn()
  })
}));

jest.mock('sqlite', () => ({
  open: jest.fn().mockResolvedValue({
    exec: jest.fn().mockResolvedValue(true),
    all: jest.fn().mockResolvedValue([{ id: 1 }]),
    run: jest.fn().mockResolvedValue({ lastID: 1, changes: 1 })
  })
}));

const db = require('../database/database');

describe('SQLite Database Wrapper', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testDatabase should return true if DB is connected', async () => {
        const result = await db.testDatabase();
        expect(result).toBe(true);
    });

    test("query returns mocked rows for SELECT", async () => {
        const result = await db.query("SELECT * FROM shelly");
        expect(result.rows[0].id).toBe(1);
    });

    test("query returns lastID and changes for INSERT/UPDATE", async () => {
        const result = await db.query(
            "INSERT INTO shelly (internal_id, user, ip, name) VALUES (?, ?, ?, ?)",
            [1, 'user', '192.168.1.1', 'Shelly']
        );
        expect(result.lastID).toBe(1);
        expect(result.changes).toBe(1);
    });
});