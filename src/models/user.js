const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    voice_id: { type: String },
    preferences: { type: mongoose.Schema.Types.Mixed },
    voice_profile: { type: mongoose.Schema.Types.Mixed },
    family_tree_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyTree' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema); 