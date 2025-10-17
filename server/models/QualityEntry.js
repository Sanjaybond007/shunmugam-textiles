const mongoose = require('mongoose');

const qualityEntrySchema = new mongoose.Schema({
  // Employee information
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  employeeName: {
    type: String,
    required: true
  },

  // Product information
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },

  // Quality values - dynamic object to store any number of qualities
  qualities: {
    type: Object,
    required: true
  },

  // Date of entry
  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Calculated subtotal
  subTotal: {
    type: Number,
    required: true,
    default: 0
  },

  // Supervisor information
  supervisorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  supervisorName: {
    type: String,
    required: true
  },

  // Additional metadata
  receiptNo: {
    type: String,
    unique: true,
    sparse: true
  },

  notes: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient querying
qualityEntrySchema.index({ employeeId: 1, date: -1 });
qualityEntrySchema.index({ productId: 1, date: -1 });
qualityEntrySchema.index({ supervisorId: 1, date: -1 });
qualityEntrySchema.index({ date: 1 });

// Pre-save middleware to calculate subtotal
qualityEntrySchema.pre('save', function(next) {
  if (this.qualities && Object.keys(this.qualities).length > 0) {
    this.subTotal = Object.values(this.qualities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  }
  next();
});

// Virtual for formatted date
qualityEntrySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for quality count
qualityEntrySchema.virtual('qualityCount').get(function() {
  return this.qualities ? Object.keys(this.qualities).length : 0;
});

// Method to get quality summary
qualityEntrySchema.methods.getQualitySummary = function() {
  if (!this.qualities) return {};
  
  const summary = {};
  for (const [key, value] of Object.entries(this.qualities)) {
    summary[key] = parseFloat(value) || 0;
  }
  return summary;
};

// Method to validate quality values
qualityEntrySchema.methods.validateQualities = function() {
  if (!this.qualities) return false;
  
  for (const [key, value] of Object.entries(this.qualities)) {
    if (typeof value !== 'number' || value < 0) {
      return false;
    }
  }
  return true;
};

// Static method to get entries by date range
qualityEntrySchema.statics.getByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    status: 'active'
  };

  if (filters.employeeId) query.employeeId = filters.employeeId;
  if (filters.productId) query.productId = filters.productId;
  if (filters.supervisorId) query.supervisorId = filters.supervisorId;

  return this.find(query).sort({ date: 1 });
};

// Static method to get summary statistics
qualityEntrySchema.statics.getSummaryStats = function(filters = {}) {
  const matchStage = { status: 'active' };
  
  if (filters.fromDate || filters.toDate) {
    matchStage.date = {};
    if (filters.fromDate) matchStage.date.$gte = new Date(filters.fromDate);
    if (filters.toDate) matchStage.date.$lte = new Date(filters.toDate);
  }
  
  if (filters.employeeId) matchStage.employeeId = filters.employeeId;
  if (filters.productId) matchStage.productId = filters.productId;
  if (filters.supervisorId) matchStage.supervisorId = filters.supervisorId;

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        totalValue: { $sum: '$subTotal' },
        avgValue: { $avg: '$subTotal' },
        uniqueEmployees: { $addToSet: '$employeeId' },
        uniqueProducts: { $addToSet: '$productId' }
      }
    },
    {
      $project: {
        totalEntries: 1,
        totalValue: 1,
        avgValue: 1,
        uniqueEmployees: { $size: '$uniqueEmployees' },
        uniqueProducts: { $size: '$uniqueProducts' }
      }
    }
  ]);
};

// Ensure virtuals are included when converting to JSON
qualityEntrySchema.set('toJSON', { virtuals: true });
qualityEntrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('QualityEntry', qualityEntrySchema); 