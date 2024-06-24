import { openDB } from './database.js';

async function setupDB() {
    const db = await openDB();
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                surname TEXT,
                birthday TEXT,
                email TEXT,
                purchases INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                timestamp TEXT,
                type TEXT
            );
        `);
        console.log('Database setup complete');
    } catch (error) {
        console.error('Failed to set up database:', error);
        throw error;
    } finally {
        await db.close();
    }
}

(async () => {
    await setupDB();
})();
