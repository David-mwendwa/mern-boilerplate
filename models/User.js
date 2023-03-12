import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      minlength: 3,
      maxlength: [30, 'Your name cannot exceed 30 Characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Your password must be longer than 6 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      trim: true,
      validate: {
        // This only works on .create() or .save()
        validator: function (val) {
          return this.password === val;
        },
        message: "Passwords don't match",
      },
    },
    avatar: {
      // cloudinary - required: true
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
      // multer
      data: Buffer,
      contentType: String,
      filename: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  // for virtual properties - don't persist in the db (created on the fly when a request is made)
  { toJSON: { virtuals: true } },
  { toOject: { virtuals: true } }
);

// encrypt password before saving user;
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined; // delete passwordConfirm field (does not need to be persistent in the db)
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

// filter out inactive users on current find query
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// compare user password => invoked as user.comparePassword(enteredPassword)
userSchema.methods.comparePassword = async function (enteredPassword, userPwd) {
  return await bcrypt.compare(enteredPassword, userPwd || this.password); // this.password can also be parsed from controller as user.password
};

// check if the password was changed after the token was issued
userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedAtTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedAtTimestamp;
  }
  return false;
};

// return JWT token => invoked as user.signToken()
userSchema.methods.signToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// generate password reset token => invoked as user.createPasswordResetToken()
userSchema.methods.createPasswordResetToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(10).toString('hex');

  // hash and set to passwordResetToken
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set token expire time
  this.passwordResetExpiresAt = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

export default mongoose.model('User', userSchema);
