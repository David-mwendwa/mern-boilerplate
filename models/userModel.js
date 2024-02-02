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
      trim: true,
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
      // cloudinary
      public_id: {
        type: String,
        required: true,
        default: `avatar_${Date.now()}`,
      },
      url: {
        type: String,
        required: true,
        default:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png',
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
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  // For virtual properties - don't persist in the db (created on the fly when a request is made)
  { toJSON: { virtuals: true } },
  { toOject: { virtuals: true } },
  { timestamps: true }
);

/**
 * Encrypt password before saving a user;
 */
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

/**
 * Filter out inactive users on current find query
 */
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

/**
 * Compare user input password with the one stored in the database
 * @param {*} inputPassword password from the request body
 * @param {*} userPwd (optional) actual user pasword on the database. Can also be parsed as this.password
 * @returns true or false
 */
userSchema.methods.comparePassword = async function (inputPassword, userPwd) {
  return await bcrypt.compare(inputPassword, userPwd || this.password);
};

/**
 * Check if the password was chnaged after the token was issued
 * @param {*} JWTTimestamp JSON Web Token timestamp
 * @returns true or false
 */
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

/**
 * Sign JSON Web Token
 * @param {*} null
 * @returns authetication token
 */
userSchema.methods.signJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

/**
 * Create password rest token
 * @param {*} null
 * @returns password reset token
 */
userSchema.methods.generatePasswordResetToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash and set to passwordResetToken field in the document
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set token expiry time - 30 minutes
  this.passwordResetExpiresAt = Date.now() + 30 * 60 * 1000;

  // return unhashed token version
  return resetToken;
};

export default mongoose.model('User', userSchema);
