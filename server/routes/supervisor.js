const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const employeeService = require('../services/employeeService');
const productService = require('../services/productService');
const qualityEntryService = require('../services/qualityEntryService');
const { verifyToken, requireRole } = require('../middleware/auth');

// Apply auth middleware to all supervisor routes
router.use(verifyToken);
router.use(requireRole('supervisor'));

// Get supervisor dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [employees, products, stockEntries] = await Promise.all([
      employeeService.getActiveEmployees(),
      productService.getActiveProducts(),
      qualityEntryService.getQualityEntriesBySupervisor(req.user.userId)
    ]);

    res.json({
      employees: employees.length,
      products: products.length,
      stockEntries: stockEntries.length,
      reports: stockEntries.length
    });
  } catch (error) {
    console.error('Supervisor stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees for supervisor (all active employees - for selection purposes)
router.get('/employees', async (req, res) => {
  try {
    const employees = await employeeService.getActiveEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products for supervisor
router.get('/products', async (req, res) => {
  try {
    const products = await productService.getActiveProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stock entries for supervisor
router.get('/stock-entries', async (req, res) => {
  try {
    const stockEntries = await qualityEntryService.getQualityEntriesBySupervisor(req.user.userId);
    // Limit to 50 most recent entries
    const limitedEntries = stockEntries.slice(0, 50);
    res.json(limitedEntries);
  } catch (error) {
    console.error('Get stock entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quality entries for supervisor with filtering
router.get('/quality-entries', async (req, res) => {
  try {
    const { fromDate, toDate, employeeId, productId } = req.query;
    
    let entries;
    if (fromDate || toDate) {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      entries = await qualityEntryService.getQualityEntriesByDateRange(startDate, endDate, filters);
    } else {
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      entries = await qualityEntryService.getAllQualityEntries(filters);
    }

    res.json(entries);
  } catch (error) {
    console.error('Get quality entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific quality entry by ID
router.get('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const qualityEntry = await qualityEntryService.findById(id);
    
    if (!qualityEntry || qualityEntry.supervisorId !== req.user.userId) {
      return res.status(404).json({ message: 'Quality entry not found or access denied' });
    }

    res.json(qualityEntry);
  } catch (error) {
    console.error('Get quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create quality entry (supervisor can create for their employees)
router.post('/quality-entries', async (req, res) => {
  try {
    const { receiptNo, employeeId, productId, q1, q2, q3, q4 } = req.body;
    
    if (!receiptNo || !employeeId || !productId) {
      return res.status(400).json({ message: 'Receipt number, employee ID, and product ID are required' });
    }

    // Verify employee and product exist
    const [employee, product] = await Promise.all([
      employeeService.findByEmployeeId(employeeId),
      productService.findById(productId)
    ]);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const qualityEntry = await qualityEntryService.createQualityEntry({
      receiptNo,
      employeeId,
      productId,
      q1: q1 || 0,
      q2: q2 || 0,
      q3: q3 || 0,
      q4: q4 || 0,
      supervisorId: req.user.userId
    });

    res.status(201).json({ message: 'Quality entry created successfully', qualityEntry });
  } catch (error) {
    console.error('Create quality entry error:', error);
    if (error.message === 'Receipt number already exists') {
      return res.status(400).json({ message: 'Receipt number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quality entry (supervisor can update their entries)
router.put('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptNo, employeeId, productId, q1, q2, q3, q4 } = req.body;

    // Find quality entry and ensure supervisor owns it
    const qualityEntry = await qualityEntryService.findById(id);
    
    if (!qualityEntry || qualityEntry.supervisorId !== req.user.userId) {
      return res.status(404).json({ message: 'Quality entry not found or access denied' });
    }

    const updateData = {};
    if (receiptNo) updateData.receiptNo = receiptNo;
    if (employeeId) updateData.employeeId = employeeId;
    if (productId) updateData.productId = productId;
    if (q1 !== undefined) updateData.q1 = q1;
    if (q2 !== undefined) updateData.q2 = q2;
    if (q3 !== undefined) updateData.q3 = q3;
    if (q4 !== undefined) updateData.q4 = q4;

    const updatedEntry = await qualityEntryService.updateQualityEntry(id, updateData);
    res.json({ message: 'Quality entry updated successfully', qualityEntry: updatedEntry });
  } catch (error) {
    console.error('Update quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quality entry (supervisor can delete their entries)
router.delete('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const qualityEntry = await qualityEntryService.findById(id);
    
    if (!qualityEntry || qualityEntry.supervisorId !== req.user.userId) {
      return res.status(404).json({ message: 'Quality entry not found or access denied' });
    }

    await qualityEntryService.deleteQualityEntry(id);
    res.json({ message: 'Quality entry deleted successfully' });
  } catch (error) {
    console.error('Delete quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports for supervisor
router.get('/reports', async (req, res) => {
  try {
    const { fromDate, toDate, employeeId, productId } = req.query;
    
    let reports;
    if (fromDate || toDate) {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      reports = await qualityEntryService.getQualityEntriesByDateRange(startDate, endDate, filters);
    } else {
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      reports = await qualityEntryService.getAllQualityEntries(filters);
    }

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add stock entry (alias for quality entry)
router.post('/stock', async (req, res) => {
  try {
    const { receiptNo, employeeId, productId, q1, q2, q3, q4 } = req.body;
    
    if (!receiptNo || !employeeId || !productId) {
      return res.status(400).json({ message: 'Receipt number, employee ID, and product ID are required' });
    }

    // Verify employee and product exist
    const [employee, product] = await Promise.all([
      employeeService.findByEmployeeId(employeeId),
      productService.findById(productId)
    ]);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stockEntry = await qualityEntryService.createQualityEntry({
      receiptNo,
      employeeId,
      productId,
      q1: q1 || 0,
      q2: q2 || 0,
      q3: q3 || 0,
      q4: q4 || 0,
      supervisorId: req.user.userId
    });

    res.status(201).json({ message: 'Stock entry created successfully', stockEntry });
  } catch (error) {
    console.error('Create stock entry error:', error);
    if (error.message === 'Receipt number already exists') {
      return res.status(400).json({ message: 'Receipt number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (supervisor can create products)
router.post('/products', async (req, res) => {
  try {
    const { name, qualities } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const product = await productService.createProduct({
      name,
      qualities: qualities || 4,
      active: true
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (supervisor can edit products)
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, qualities, active } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (qualities !== undefined) updateData.qualities = qualities;
    if (active !== undefined) updateData.active = active;

    const product = await productService.updateProduct(id, updateData);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate report
router.get('/reports/generate', async (req, res) => {
  try {
    const { fromDate, toDate, employeeId, productId } = req.query;
    
    let reports;
    if (fromDate || toDate) {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      reports = await qualityEntryService.getQualityEntriesByDateRange(startDate, endDate, filters);
    } else {
      const filters = { supervisorId: req.user.userId };
      if (employeeId) filters.employeeId = employeeId;
      if (productId) filters.productId = productId;
      
      reports = await qualityEntryService.getAllQualityEntries(filters);
    }

    // For now, return JSON. In production, you'd generate Excel file
    res.json({
      message: 'Report generated successfully',
      reports: reports.length,
      data: reports,
      filters: { fromDate, toDate, employeeId, productId }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get production stats for supervisor
router.get('/stats/production', async (req, res) => {
  try {
    const { employeeId, productId, startDate, endDate } = req.query;
    
    const filters = { supervisorId: req.user.userId };
    if (employeeId) filters.employeeId = employeeId;
    if (productId) filters.productId = productId;
    
    const stats = await qualityEntryService.getQualityStats(filters);
    res.json(stats);
  } catch (error) {
    console.error('Get production stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
