const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Chave secreta Stripe

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/create-checkout-session", async (req, res) => {
  const { asset, value, quantity } = req.body;
  try {
    if (!value || value <= 0 || !quantity) {
      return res.status(400).json({ error: "Valor ou quantidade inválida" });
    }

    const totalAmount = Math.round(value * quantity * 100); // centavos

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Compra de ${asset}` },
          unit_amount: totalAmount,
        },
        quantity,
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
