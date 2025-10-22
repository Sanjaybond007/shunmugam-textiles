const express = require('express');
const router = express.Router();
const companyInfoService = require('../services/companyInfoService');
const productService = require('../services/productService');
const contactService = require('../services/contactService');

// Get company information
router.get('/company-info', async (req, res) => {
  try {
    const info = await companyInfoService.getCompanyInfo();
    res.json(info || {});
  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test Firebase connection
router.get('/test-db', async (req, res) => {
  try {
    console.log('Testing Firebase connection...');
    const { getFirestore } = require('../config/firebaseAdmin');
    const db = getFirestore();
    
    if (!db) {
      return res.status(500).json({ message: 'Firebase not initialized' });
    }
    
    // Try a simple query
    const testCollection = await db.collection('products').limit(1).get();
    console.log('Firebase connection test successful');
    
    res.json({ 
      message: 'Firebase connection successful',
      hasProducts: !testCollection.empty,
      productCount: testCollection.size
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({ 
      message: 'Firebase connection failed',
      error: error.message 
    });
  }
});

// Debug endpoint to see all products with their active status
router.get('/products-debug', async (req, res) => {
  try {
    const allProducts = await productService.getAllProducts();
    const activeProducts = await productService.getActiveProducts();
    
    res.json({
      totalProducts: allProducts.length,
      activeProducts: activeProducts.length,
      allProductsData: allProducts.map(p => ({
        id: p.id,
        name: p.name,
        active: p.active,
        hasActiveField: p.hasOwnProperty('active')
      })),
      activeProductsData: activeProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Temporary fix endpoint to set all products as active
router.post('/fix-products-active', async (req, res) => {
  try {
    const allProducts = await productService.getAllProducts();
    console.log('Fixing active status for', allProducts.length, 'products...');
    
    let updatedCount = 0;
    for (const product of allProducts) {
      if (product.active !== true) {
        await productService.updateProduct(product.id, { active: true });
        updatedCount++;
      }
    }
    
    res.json({
      message: 'Products updated successfully',
      totalProducts: allProducts.length,
      updatedProducts: updatedCount
    });
  } catch (error) {
    console.error('Fix products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all products for public display
router.get('/products', async (req, res) => {
  try {
    console.log('Fetching products for public display...');
    
    // Temporary fix: Return all products since the active filter isn't working
    const allProducts = await productService.getAllProducts();
    console.log('All products in database:', allProducts.length);
    
    // Filter manually for active products as a workaround
    const activeProducts = allProducts.filter(product => product.active === true);
    console.log('Manually filtered active products:', activeProducts.length);
    
    // Return the manually filtered active products
    res.json(activeProducts);
  } catch (error) {
    console.error('Get products error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});







// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    await contactService.createContactSubmission({
      name,
      email,
      phone: phone || null,
      message
    });

    res.json({ message: 'Thank you for your message. We will get back to you soon!' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact submissions (admin only)
router.get('/contact-submissions', async (req, res) => {
  try {
    const submissions = await contactService.getAllContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company information
router.put('/company-info', async (req, res) => {
  try {
    const { name, description, mission, address, phone, email, website } = req.body;

    await companyInfoService.updateCompanyInfo({
      name,
      description,
      mission,
      address,
      phone,
      email,
      website
    });

    res.json({ message: 'Company information updated successfully' });
  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get founders/directors for public display (placeholder - no founder service created)
router.get('/founders', async (req, res) => {
  try {
    // Return empty array for now since we don't have a founder service
    res.json([]);
  } catch (error) {
    console.error('Get founders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 