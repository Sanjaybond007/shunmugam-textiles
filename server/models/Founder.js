const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
founderSchema.index({ order: 1, name: 1 });
founderSchema.index({ active: 1 });

// Virtual for formatted name
founderSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.position}`;
});

// Method to get active founders
founderSchema.statics.getActive = function() {
  return this.find({ active: true }).sort({ order: 1, name: 1 });
};

// Method to get by position
founderSchema.statics.getByPosition = function(position) {
  return this.find({ position: { $regex: position, $options: 'i' }, active: true });
};

module.exports = mongoose.model('Founder', founderSchema);

