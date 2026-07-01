const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('./application.constants');

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program is required'],
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // ------------------- Custom Fields -------------------
    emergencyContactName: { type: String, required: false },
    emergencyContactPhone: { type: String, required: false },
    medicalConditions: { type: String, required: false },
    backgroundCheckConsent: { type: Boolean, default: false },
    codeOfConductAgreement: { type: Boolean, required: true },
    mediaConsent: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, required: true },
    privacyAccepted: { type: Boolean, required: true },
    // ---------------------------------------------------
    documents: [{
      url: { type: String, required: true },
      key: { type: String },
      originalName: { type: String },
      mimeType: { type: String },
      size: { type: Number }
    }],
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      default: null,
    },
    withdrawnAt: {
      type: Date,
      default: null,
    },
    withdrawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, isDeleted: false });
applicationSchema.index({ program: 1, isDeleted: false });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ applicationId: 1 }, { unique: true, sparse: true });

applicationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
