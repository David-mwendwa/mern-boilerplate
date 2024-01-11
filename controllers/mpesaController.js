import moment from 'moment';
import axios from 'axios';
import Mpesa from '../models/mpesaModel.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

// send a post request to the stk
export const stkpush = async (req, res) => {
  const amount = req.body.amount;
  let phone = req.body.phone; // format: 2547xxxxxxxx
  if (/^\+?254/.test(phone)) {
    phone = phone.replace(/^\+/, '');
  } else if (/^0/.test(phone)) {
    phone = `254${phone.substring(1)}`;
  }
  if (!phone || !amount) {
    throw new BadRequestError('provide your phone number and amount to pay');
  }

  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    'base64'
  );
  let url = process.env.LIPA_NA_MPESA_URL;
  if (/production/i.test(process.env.NODE_ENV)) {
    url = url.replace(/sandbox/, 'api');
  }

  let { data } = await axios.post(
    url,
    {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: 'https://mydomain.com/path', // use  the correct callbackURL
      AccountReference: 'Mpesa Test', //'Test',
      TransactionDesc: 'Testing STK Push',
    },
    {
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
    }
  );
  return res.status(200).json({ success: true, data });
};

// persits transaction on the database after payment
export const callback = async (req, res) => {
  let body = req.body;
  let { ResultCode, ResultDesc } = body.Body.stkCallback;
  let receipt,
    amount,
    phone,
    date = '';

  if (ResultCode != 0) {
    throw new BadRequestError(ResultDesc);
  }
  let list = body.Body.stkCallback.CallbackMetadata.Item;
  list.forEach((item) => {
    if (item.Name === 'MpesaReceiptNumber') {
      receipt = item.Value;
    }
    if (item.Name === 'TransactionDate') {
      date = item.Value;
    }
    if (item.Name === 'PhoneNumber') {
      phone = item.Value;
    }
    if (item.Name === 'Amount') {
      amount = item.Value;
    }
  });
  const returnObj = { receipt, amount, phone, date };
  const transaction = await Mpesa.create(returnObj);
  return res
    .status(201)
    .json({ success: true, data: { ResultDesc, transaction } });
};

export const validate = async (req, res, next) => {
  const { payload } = req.body;
  const MerchantRequestID = payload.MerchantRequestID;

  const transaction = await Mpesa.findOne({
    MerchantRequestID: MerchantRequestID,
  });
  if (transaction == null) {
    throw new NotFoundError('Cannot find transaction');
  }
  res.status(200).json({ success: true, data: transaction });
};

export const getTransactions = async (req, res) => {
  const transactions = await Mpesa.find();
  return res.status(200).json({ success: true, data: transactions });
};
