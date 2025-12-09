const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function init() {
    const db = await open({
        filename: "./mydb.sqlite",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS shelly (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            internal_id INTEGER NOT NULL,
            user TEXT NOT NULL,
            ip TEXT NOT NULL,
            name TEXT NOT NULL,
            isActivated INTEGER DEFAULT FALSE
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS consumption (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shellyid INTEGER NOT NULL,
            entry_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            output BOOLEAN,
            apower REAL,
            voltage REAL,
            frequency REAL,
            current REAL,
            aenergy REAL,
            ret_aenergy REAL,
            temperature REAL
        );     
    `);

    return db;
}

const dbPromise = init();


const dbWrapper = {
    query: async (sql, params = []) => {
        const db = await dbPromise;
        const isSelect = sql.trim().toLowerCase().startsWith("select");

        if (isSelect) {
            const rows = await db.all(sql, params);
            return { rows };
        } else {
            const result = await db.run(sql, params);
            return {
                rows: [],
                lastID: result.lastID,
                changes: result.changes
            };
        }
    }
};

dbWrapper.testDatabase = async () => {
    try {
        await dbWrapper.query("SELECT 1");
        return true;
    } catch (err) {
        console.error("DB test failed:", err);
        return false;
    }
};

module.exports = dbWrapper;


