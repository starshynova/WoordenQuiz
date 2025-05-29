import express from 'express';
import { createCheckoutSession } from '../controllers/payment.js';

const paymentRouter = express.Router();

paymentRouter.post('/', createCheckoutSession);

export default paymentRouter;
