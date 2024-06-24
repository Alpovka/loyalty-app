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

        await db.run('INSERT INTO customers (name, surname, birthday, email, purchases) VALUES (?, ?, ?, ?, ?)', [name, surname, birthday, email, 1]);
        await db.run('INSERT INTO transactions (email, timestamp, type) VALUES (?, ?, ?)', [email, new Date().toISOString(), 'purchase']);

        let reward = null;
        const today = new Date();
        const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;
        const customerBirthday = new Date(birthday);
        const customerBirthdayMonthDay = `${customerBirthday.getMonth() + 1}-${customerBirthday.getDate()}`;

        if (todayMonthDay === customerBirthdayMonthDay) {
            reward = 'Free Birthday Smoothie';
            await db.run('INSERT INTO transactions (email, timestamp, type) VALUES (?, ?, ?)', [email, new Date().toISOString(), 'free birthday smoothie']);
        }

        return { reward };
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
            const today = new Date();
            const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;
            const customerBirthday = new Date(customer.birthday);
            const customerBirthdayMonthDay = `${customerBirthday.getMonth() + 1}-${customerBirthday.getDate()}`;

            const transactionsToday = await db.all('SELECT * FROM transactions WHERE email = ? AND DATE(timestamp) = DATE(?)', [email, today.toISOString()]);
            const freeSmoothieToday = transactionsToday.some(transaction => transaction.type === 'free birthday smoothie');

            let reward = null;
            let purchases = customer.purchases + 1;

            if (purchases % 8 === 0) {
                reward = 'Free Smoothie';
                await db.run('INSERT INTO transactions (email, timestamp, type) VALUES (?, ?, ?)', [email, new Date().toISOString(), 'free smoothie']);
            }
            if (todayMonthDay === customerBirthdayMonthDay && !freeSmoothieToday) {
                reward = 'Free Birthday Smoothie';
                await db.run('INSERT INTO transactions (email, timestamp, type) VALUES (?, ?, ?)', [email, new Date().toISOString(), 'free birthday smoothie']);
            }

            await db.run('UPDATE customers SET purchases = ? WHERE email = ?', [purchases, email]);
            await db.run('INSERT INTO transactions (email, timestamp, type) VALUES (?, ?, ?)', [email, new Date().toISOString(), 'purchase']);

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
