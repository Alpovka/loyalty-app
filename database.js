// database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDB() {
    return open({
        filename: './loyalty.db',
        driver: sqlite3.Database,
    });
}

async function addCustomer(name, surname, birthday, email) {
    const db = await openDB();
    try {
        const existingCustomer = await db.get('SELECT * FROM customers WHERE email = ?', [email]);
        if (existingCustomer) {
            throw new Error('A customer with this email already exists.');
        }
        await db.run('INSERT INTO customers (name, surname, birthday, email) VALUES (?, ?, ?, ?)', [name, surname, birthday, email]);
    } catch (error) {
        console.error('Failed to add customer:', error);
        throw error;
    } finally {
        await db.close();
    }
}

async function recordPurchase(email) {
    const db = await openDB();
    try {
        const customer = await db.get('SELECT * FROM customers WHERE email = ?', [email]);
        if (customer) {
            const purchases = customer.purchases + 1;
            await db.run('UPDATE customers SET purchases = ? WHERE email = ?', [purchases, email]);

            let reward = null;
            if (purchases % 8 === 0) reward = 'Free Smoothie';
            const today = new Date().toISOString().slice(0, 10);
            if (customer.birthday === today) reward = 'Free Birthday Smoothie';

            return { purchases, reward };
        } else {
            throw new Error('Customer not found');
        }
    } catch (error) {
        console.error('Failed to record purchase:', error);
        throw error;
    } finally {
        await db.close();
    }
}

export { openDB, addCustomer, recordPurchase };
