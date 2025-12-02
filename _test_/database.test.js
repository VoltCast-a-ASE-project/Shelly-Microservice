const db = require('../database/database');

describe('SQLite Database Wrapper', () => {
    test('testDatabase should return true if DB is connected', async () => {
        const result = await db.testDatabase();
        expect(result).toBe(true);
    });

    test('should create, insert and select from shelly table', async () => {
        const insertResult = await db.query(
            'INSERT INTO shelly (internal_id, user, ip, name) VALUES (?, ?, ?, ?)',
            [1, 'testuser', '192.168.1.1', 'Shelly A']
        );

        expect(insertResult.lastID).toBeGreaterThan(0);

        const selectResult = await db.query(
            'SELECT * FROM shelly WHERE id=?',
            [insertResult.lastID]
        );

        expect(selectResult.rows.length).toBe(1);
        expect(selectResult.rows[0].name).toBe('Shelly A');
    });

    test('should update a record', async () => {
        const insertResult = await db.query(
            'INSERT INTO shelly (internal_id, user, ip, name) VALUES (?, ?, ?, ?)',
            [2, 'testuser2', '192.168.1.2', 'Shelly B']
        );

        const updateResult = await db.query(
            'UPDATE shelly SET name=? WHERE id=?',
            ['Shelly B Updated', insertResult.lastID]
        );

        expect(updateResult.changes).toBe(1);

        const selectResult = await db.query(
            'SELECT * FROM shelly WHERE id=?',
            [insertResult.lastID]
        );

        expect(selectResult.rows[0].name).toBe('Shelly B Updated');
    });
});
