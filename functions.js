// database.js
import { query } from './db'

async function addCustomer(name, surname, birthday, email) {
  try {
    const existingCustomerResult = await query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    )
    const existingCustomer = existingCustomerResult.rows[0]
    if (existingCustomer) {
      throw new Error('A customer with this email already exists.')
    }

    await query(
      'INSERT INTO customers (name, surname, birthday, email, purchases) VALUES ($1, $2, $3, $4, $5)',
      [name, surname, birthday, email, 1]
    )
    await query(
      'INSERT INTO transactions (email, timestamp, type) VALUES ($1, $2, $3)',
      [email, new Date().toISOString(), 'purchase']
    )

    let reward = null
    const today = new Date()
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`
    const customerBirthday = new Date(birthday)
    const customerBirthdayMonthDay = `${customerBirthday.getMonth() + 1}-${customerBirthday.getDate()}`

    if (todayMonthDay === customerBirthdayMonthDay) {
      reward = 'Free Birthday Smoothie'
      await query(
        'INSERT INTO transactions (email, timestamp, type) VALUES ($1, $2, $3)',
        [email, new Date().toISOString(), 'free birthday smoothie']
      )
    }

    return { reward }
  } catch (error) {
    console.error('Failed to add customer:', error)
    throw error
  }
}

async function recordPurchase(email) {
  try {
    const customerResult = await query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    )
    const customer = customerResult.rows[0]

    if (customer) {
      const today = new Date()
      const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`
      const customerBirthday = new Date(customer.birthday)
      const customerBirthdayMonthDay = `${customerBirthday.getMonth() + 1}-${customerBirthday.getDate()}`

      const transactionsTodayResult = await query(
        'SELECT * FROM transactions WHERE email = $1 AND DATE(timestamp) = DATE($2)',
        [email, today.toISOString()]
      )
      const transactionsToday = transactionsTodayResult.rows
      const freeSmoothieToday = transactionsToday.some(
        (transaction) => transaction.type === 'free birthday smoothie'
      )

      let reward = null
      let purchases = customer.purchases + 1

      if (purchases % 8 === 0) {
        reward = 'Free Smoothie'
        await query(
          'INSERT INTO transactions (email, timestamp, type) VALUES ($1, $2, $3)',
          [email, new Date().toISOString(), 'free smoothie']
        )
      }
      if (todayMonthDay === customerBirthdayMonthDay && !freeSmoothieToday) {
        reward = 'Free Birthday Smoothie'
        await query(
          'INSERT INTO transactions (email, timestamp, type) VALUES ($1, $2, $3)',
          [email, new Date().toISOString(), 'free birthday smoothie']
        )
      }

      await query('UPDATE customers SET purchases = $1 WHERE email = $2', [
        purchases,
        email
      ])
      await query(
        'INSERT INTO transactions (email, timestamp, type) VALUES ($1, $2, $3)',
        [email, new Date().toISOString(), 'purchase']
      )

      return { purchases, reward }
    } else {
      throw new Error('Customer not found')
    }
  } catch (error) {
    console.error('Failed to record purchase:', error)
    throw error
  }
}

export { addCustomer, recordPurchase }
