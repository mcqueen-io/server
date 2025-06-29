const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toolId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

tokenSchema.index({ userId: 1, toolId: 1 }, { unique: true });

module.exports = mongoose.model('Token', tokenSchema); 