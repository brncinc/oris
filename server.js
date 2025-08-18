app.post("/api/generate", (req, res) => {
  try {
    const { value, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    if (!value || isNaN(value) || value <= 0 || qty <= 0) {
      return res.status(400).json({ error: "Valor ou quantidade inválida" });
    }

    const totalValue = value * qty;
    const pixKey = "806a60a4-ec70-4ae4-8cee-775c1bc7646b";
    const valorPix = Math.round(totalValue * 100); // em centavos

    const pixPayload =
      `00020126360014BR.GOV.BCB.PIX01${pixKey}` +
      `520400005303986540${valorPix}` +
      `5802BR5913Meta Rabbit6009Sao Paulo62070503***6304`;

    const streamKey = `STREAM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return res.json({ pixPayload, streamKey, totalValue: totalValue.toFixed(2) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});
