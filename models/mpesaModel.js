import mongoose from 'mongoose';
// Create User Schema
const mpesaSchema = mongoose.Schema(
  {
    receipt: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model('Mpesa', mpesaSchema);
