const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const CompanyInfo = require('../models/CompanyInfo');
require('dotenv').config();

const initDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shunmugam_textiles', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await CompanyInfo.deleteMany({});

    // Create default admin user
    const adminUser = new User({
      userId: 'admin',
      name: 'Administrator',
      password: 'password',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create default supervisor user
    const supervisorUser = new User({
      userId: 'supervisor',
      name: 'Supervisor',
      password: 'password',
      role: 'supervisor'
    });
    await supervisorUser.save();
    console.log('Supervisor user created');

    // Create default products
    const products = [
      { name: 'Cotton Fabric', qualities: 4 },
      { name: 'Silk Fabric', qualities: 4 },
      { name: 'Wool Fabric', qualities: 4 },
      { name: 'Synthetic Fabric', qualities: 4 }
    ];

    for (const product of products) {
      const newProduct = new Product(product);
      await newProduct.save();
    }
    console.log('Default products created');

    // Create company info
    const companyInfo = new CompanyInfo({
      name: 'Shunmugam Textiles',
      description: 'Leading textile manufacturer with over 20 years of experience in producing high-quality fabrics for global markets.',
      mission: 'To provide the highest quality textiles while maintaining sustainable practices and supporting our local community.',
      address: '123 Textile Street, Industrial Area, Chennai, Tamil Nadu, India',
      phone: '+91-44-12345678',
      email: 'info@shunmugamtextiles.com',
      website: 'www.shunmugamtextiles.com'
    });
    await companyInfo.save();
    console.log('Company info created');

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDB(); 