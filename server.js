// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // body-parser já incluso no express >= 4.16

// Endpoint para gerar PIX e Stream Key
app.post("/api/generate", (req, res) => {
  try {
    const { value, quantity } = req.body;
    const qty = parseInt(quantity) || 1;
    const val = parseFloat(value);

    if (!val || isNaN(val) || val <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    if (qty <= 0) return res.status(400).json({ error: "Quantidade inválida" });

    const totalValue = val * qty;

    // Chave PIX Z-OBTC
    const pixKey = "806a60a4-ec70-4ae4-8cee-775c1bc7646b";
    const valorPix = totalValue.toFixed(2).replace(".", "");

    const pixPayload =
      `00020126360014BR.GOV.BCB.PIX0136${pixKey}` +
      `520400005303986540${valorPix}5802BR` +
      `5913Meta Rabbit6009Sao Paulo62070503***6304`;

    const streamKey = `STREAM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return res.json({ pixPayload, streamKey });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// Servir arquivos estáticos (HTML/JS/CSS)
app.use(express.static(path.join(__dirname, "public")));

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
