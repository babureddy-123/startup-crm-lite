import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition for authentication and access roles.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * User's display name.
     * Must be between 2 and 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * User's email address.
     * Must be a valid format, lowercase, unique, and trimmed.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address'
      ]
    },
    /**
     * User's hashed authentication password.
     * Hashed automatically using bcrypt in pre-save middleware.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    /**
     * User's role inside the CRM application.
     * Restricts routes and resources based on admin privileges.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user'
      },
      default: 'user'
    },
    /**
     * Flag indicating if the user profile is active.
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to automatically hash modified passwords using bcryptjs.
 */
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compares a plain text candidate password with the user's stored hashed password.
 *
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} True if matches, false otherwise.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Custom override of the toJSON method to strip password details from serialization.
 */
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', UserSchema);

export { UserSchema };
export default User;
