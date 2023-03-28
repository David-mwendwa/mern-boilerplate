import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [],
    shippingAddress: { type: Object },
    orderAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipping', 'delivered'],
      required: true,
      default: 'processing',
    },
    transactionId: { type: String, required: true },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
