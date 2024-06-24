// pages/api/customers/purchase.js
import { recordPurchase } from '../../../database.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;
        try {
            const result = await recordPurchase(email);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
