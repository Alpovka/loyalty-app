import { recordPurchase } from "../../../database.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const { purchases, reward } = await recordPurchase(email);
      res.status(200).json({ purchases, reward });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
