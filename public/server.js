// server.js
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // configure a chave no .env

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // sua pasta com HTML/JS

app.post("/api/create-checkout-session", async (req, res) => {
  const { asset, value, quantity } = req.body;

  if (!value || value <= 0 || !asset) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: asset },
            unit_amount: Math.round(value * 100), // valor em centavos
          },
          quantity: quantity || 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
