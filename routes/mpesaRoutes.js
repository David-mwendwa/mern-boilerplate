import express from 'express';
import { generateMpesaToken } from '../middleware/auth.js';
import {
  stkpush,
  callback,
  validate,
  getTransactions,
} from '../controllers/mpesaController.js';

const router = express.Router();

router.post('/mpesa/stkpush', generateMpesaToken, stkpush);
// router.post('/mpesa/callback', callback);
// router.post('/mpesa/validate', validate);
// router.get('/mpesa/transactions', getTransactions);

export default router;
