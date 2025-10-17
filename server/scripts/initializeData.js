const userService = require('../services/userService');
const productService = require('../services/productService');
const companyInfoService = require('../services/companyInfoService');

async function initializeData() {
  try {
    console.log('Initializing Firebase Firestore data...');

    // Create default admin user
    try {
      const adminExists = await userService.userExists('admin');
      if (!adminExists) {
        await userService.createUser({
          userId: 'admin',
          name: 'Administrator',
          password: 'admin123', // This will be hashed
          role: 'admin'
        });
        console.log('✓ Default admin user created');
      } else {
        console.log('✓ Admin user already exists');
      }
    } catch (error) {
      console.log('✓ Admin user already exists or error:', error.message);
    }

    // Create sample products
    const sampleProducts = [
      { name: 'Cotton Fabric', qualities: 4 },
      { name: 'Silk Fabric', qualities: 4 },
      { name: 'Wool Fabric', qualities: 4 },
      { name: 'Synthetic Fabric', qualities: 4 }
    ];

    for (const product of sampleProducts) {
      try {
        const exists = await productService.productExists(product.name);
        if (!exists) {
          await productService.createProduct(product);
          console.log(`✓ Created product: ${product.name}`);
        } else {
          console.log(`✓ Product already exists: ${product.name}`);
        }
      } catch (error) {
        console.log(`✓ Product ${product.name} already exists or error:`, error.message);
      }
    }

    // Initialize company info
    try {
      const companyInfoExists = await companyInfoService.companyInfoExists();
      if (!companyInfoExists) {
        await companyInfoService.createDefaultCompanyInfo();
        console.log('✓ Default company info created');
      } else {
        console.log('✓ Company info already exists');
      }
    } catch (error) {
      console.log('✓ Company info already exists or error:', error.message);
    }

    console.log('🎉 Data initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  initializeData()
    .then(() => {
      console.log('Initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeData;
