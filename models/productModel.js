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
    // multer
    // image: {
    //   data: Buffer,
    //   contentType: String,
    //   filename: String,
    // },
    category: {
      type: String,
      enum: ['', 'values...'],
      default: '',
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
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
  // For virtual properties
  { toJSON: { virtuals: true } },
  { toOject: { virtuals: true } }
);

/**
 * virtuals are document properties that are not stored in the database
 * They only exist logically or are usually created on the fly when computing something
 * @reference https://mongoosejs.com/docs/tutorials/virtuals.html
 */
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

/**
 * Delete all reviews related to a product being deleted
 */
productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

export default mongoose.model('Product', productSchema);
