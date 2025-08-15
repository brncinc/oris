// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Servir arquivos estáticos da pasta "public"

// Endpoint para gerar PIX e Stream Key
app.post("/api/generate", (req, res) => {
  try {
    const { value, quantity } = req.body;

    if (!value || isNaN(value) || value <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    const totalValue = value * (quantity || 1);
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

// Inicia servidor em todas as interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
