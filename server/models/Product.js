const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  qualities: {
    type: Number,
    default: 4
  },
  qualityNames: [{
    type: String,
    default: function() {
      return Array.from({ length: this.qualities || 4 }, (_, i) => `Quality ${i + 1}`);
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 