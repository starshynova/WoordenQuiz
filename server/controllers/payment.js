import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card', 'ideal'],
      payment_method_data: {
    }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};