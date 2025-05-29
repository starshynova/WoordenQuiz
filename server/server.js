import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import woordenRouter from './routes/woorden.js';
import userRouter from './routes/users.js';
import paymentRouter from './routes/payment.js';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/word', woordenRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter);

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
