const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  mission: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  website: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyInfo', companyInfoSchema); 