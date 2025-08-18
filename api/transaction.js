import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req,res){
  if(req.method==="POST"){
    const { walletId, amount, pixKey } = req.body;
    const txid = "TX"+Date.now();

    // Inserir transação
    await pool.query(
      "INSERT INTO transactions (wallet_id, amount, pix_key, txid) VALUES ($1,$2,$3,$4)",
      [walletId, amount, pixKey, txid]
    );

    // Atualizar saldo
    await pool.query(
      "UPDATE wallets SET balance = balance + $1 WHERE id=$2",
      [amount, walletId]
    );

    res.json({ success:true, txid });
  }
}
