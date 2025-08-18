const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Função para simular preço Z-OBTC
async function getZOBTCPrice(asset) {
  return 1.2; // 1 Z-OBTC = 1,2 USD
}

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { asset, value, quantity } = req.body;
    if (!value || value <= 0 || !quantity || !asset) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const baseAmountUSD = value * quantity;
    const pricePerUnit = await getZOBTCPrice(asset);
    const adjustedAmount = baseAmountUSD * pricePerUnit;
    const fee = adjustedAmount * 0.0075; // taxa 0,75%
    const finalAmountUSD = adjustedAmount + fee;
    const totalCents = Math.round(finalAmountUSD * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Compra de ${asset} (Z-OBTC)` },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar sessão Stripe" });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Servidor rodando...");
});
