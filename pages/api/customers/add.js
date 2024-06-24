// pages/api/customers/add.js
import { addCustomer } from '../../../functions'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, surname, birthday, email } = req.body
    try {
      const { reward } = await addCustomer(name, surname, birthday, email)
      res.status(200).json({ message: 'Customer added successfully', reward })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
