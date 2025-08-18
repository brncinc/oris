import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // coloque a chave secreta no Vercel ENV

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { asset, value, quantity } = req.body;

  if (!asset || !value || !quantity) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: asset,
            },
            unit_amount: Math.round(value * 100), // Stripe usa centavos
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar sessão Stripe" });
  }
}
