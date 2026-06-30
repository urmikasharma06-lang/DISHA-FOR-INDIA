const mongoose = require('mongoose');
const { ROLES, STATUS } = require('./user.constants');

const userSchema = new mongoose.Schema(
  {
    // Authentication & System Fields
    volunteerId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/missing for users who haven't completed registration or are admins
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: function () {
        // Password is only required if googleId is not present
        return !this.googleId;
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VOLUNTEER,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },

    // Basic Information
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    dateOfBirth: {
      type: Date,
    },

    // Education
    college: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
    },
    educationLevel: {
      type: String,
      trim: true,
    },

    // Location
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },

    // Volunteer Profile
    profilePhoto: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, 'About section cannot exceed 500 characters'],
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: [
      {
        type: String,
        trim: true,
      },
    ],
    resume: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },

    // Volunteer Statistics
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    hoursCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Hours completed cannot be negative'],
    },
    programsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Programs completed cannot be negative'],
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Integration & Token Fields
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Additional indexes (email, username, volunteerId already indexed via unique: true)
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

// Method to remove sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
