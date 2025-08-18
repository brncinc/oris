import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if(req.method === "POST") {
    const { action, seed, balance } = req.body;

    if(action === "create") {
      const publicKey = "PUB-" + Math.random().toString(36).substr(2,8).toUpperCase();
      const result = await pool.query(
        "INSERT INTO wallets (seed, public_key, balance) VALUES ($1,$2,$3) RETURNING *",
        [seed, publicKey, 0]
      );
      return res.json({ wallet: result.rows[0] });
    }

    if(action === "import") {
      const result = await pool.query(
        "SELECT * FROM wallets WHERE seed=$1",
        [seed]
      );
      if(result.rows.length === 0) return res.status(404).json({error:"Wallet not found"});
      return res.json({ wallet: result.rows[0] });
    }
  }

  if(req.method === "GET") {
    const { seed } = req.query;
    const result = await pool.query("SELECT * FROM wallets WHERE seed=$1", [seed]);
    if(result.rows.length === 0) return res.status(404).json({error:"Wallet not found"});
    return res.json({ wallet: result.rows[0] });
  }
}
