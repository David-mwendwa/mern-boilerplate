import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    // cloudinary images
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      enum: {
        values: ['...input categories'],
        message: 'Please select correct category for the product',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Please select product stock'],
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
