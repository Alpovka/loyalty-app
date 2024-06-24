// setupDB.js
import { query } from './db.js'

async function setupDB() {
  try {
    // Check if the setup has already been done
    const result = await query(`SELECT to_regclass('public.customers')`)
    if (result.rows[0].to_regclass) {
      console.log('Database setup already complete')
      return
    }

    // Create the customers table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        birthday DATE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        purchases INTEGER DEFAULT 0
      );
    `)

    // Create the transactions table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        type TEXT NOT NULL,
        FOREIGN KEY (email) REFERENCES customers (email)
      );
    `)

    console.log('Database setup complete')
  } catch (error) {
    console.error('Failed to set up database:', error)
    throw error
  }
}

;(async () => {
  await setupDB()
})()
