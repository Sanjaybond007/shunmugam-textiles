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

// Get all products for public display
router.get('/products', async (req, res) => {
  try {
    const products = await productService.getActiveProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
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