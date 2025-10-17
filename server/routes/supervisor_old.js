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
    const stockEntries = await QualityEntry.find({ supervisorId: req.user.userId })
      .sort({ date: -1 })
      .limit(50);

    res.json(stockEntries);
  } catch (error) {
    console.error('Get stock entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quality entries for supervisor with filtering
router.get('/quality-entries', async (req, res) => {
  try {
    const { fromDate, toDate, employeeId, productId } = req.query;
    
    let query = { supervisorId: req.user.userId };
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (employeeId) query.employeeId = employeeId;
    if (productId) query.productId = productId;

    const qualityEntries = await QualityEntry.find(query)
      .sort({ date: -1 });

    res.json(qualityEntries);
  } catch (error) {
    console.error('Get quality entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific quality entry by ID
router.get('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const qualityEntry = await QualityEntry.findOne({
      _id: id,
      supervisorId: req.user.userId
    });

    if (!qualityEntry) {
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
    const { employeeId, productId, qualities, date } = req.body;
    
    if (!employeeId || !productId || !qualities || !date) {
      return res.status(400).json({ message: 'Employee ID, product ID, qualities, and date are required' });
    }

    // Get employee and product details
    const [employee, product] = await Promise.all([
      Employee.findOne({ employeeId }),
      Product.findById(productId)
    ]);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate subtotal
    const subTotal = Object.values(qualities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

    const qualityEntry = new QualityEntry({
      employeeId,
      employeeName: employee.name,
      productId,
      productName: product.name,
      qualities,
      date: new Date(date),
      subTotal,
      supervisorId: req.user.userId,
      supervisorName: req.user.name
    });

    await qualityEntry.save();
    res.status(201).json({ message: 'Quality entry created successfully', qualityEntry });
  } catch (error) {
    console.error('Create quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quality entry (supervisor can update their entries)
router.put('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, productId, qualities, date } = req.body;

    // Find quality entry and ensure supervisor owns it
    const qualityEntry = await QualityEntry.findOne({
      _id: id,
      supervisorId: req.user.userId
    });

    if (!qualityEntry) {
      return res.status(404).json({ message: 'Quality entry not found or access denied' });
    }

    // Update fields if provided
    if (employeeId) {
      const employee = await Employee.findOne({ employeeId });
      if (employee) {
        qualityEntry.employeeId = employeeId;
        qualityEntry.employeeName = employee.name;
      }
    }

    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        qualityEntry.productId = productId;
        qualityEntry.productName = product.name;
      }
    }

    if (date) qualityEntry.date = new Date(date);
    if (qualities) qualityEntry.qualities = qualities;

    // Recalculate subtotal if qualities changed
    if (qualities) {
      qualityEntry.subTotal = Object.values(qualities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    }

    await qualityEntry.save();
    res.json({ message: 'Quality entry updated successfully', qualityEntry });
  } catch (error) {
    console.error('Update quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quality entry (supervisor can delete their entries)
router.delete('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const qualityEntry = await QualityEntry.findOneAndDelete({
      _id: id,
      supervisorId: req.user.userId
    });
    
    if (!qualityEntry) {
      return res.status(404).json({ message: 'Quality entry not found or access denied' });
    }

    res.json({ message: 'Quality entry deleted successfully' });
  } catch (error) {
    console.error('Delete quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees assigned to this supervisor
router.get('/my-employees', async (req, res) => {
  try {
    const employees = await Employee.find({ 
      supervisorId: req.user.userId,
      status: 'active' 
    }).sort({ name: 1 });
    
    res.json(employees);
  } catch (error) {
    console.error('Get my employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports for supervisor
router.get('/reports', async (req, res) => {
  try {
    const { fromDate, toDate, employeeId, productId } = req.query;
    
    let query = { supervisorId: req.user.userId };
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (employeeId) query.employeeId = employeeId;
    if (productId) query.productId = productId;

const reports = await QualityEntry.find(query)
      .sort({ receiptNumber: 1, date: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add stock entry
router.post('/stock', async (req, res) => {
  try {
    const { employeeId, productId, qualities, date } = req.body;
    
    if (!employeeId || !productId || !qualities || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get employee and product details
    const [employee, product] = await Promise.all([
      Employee.findOne({ employeeId }),
      Product.findById(productId)
    ]);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate subtotal
    const subTotal = Object.values(qualities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

    const stockEntry = new QualityEntry({
      employeeId,
      employeeName: employee.name,
      productId,
      productName: product.name,
      qualities,
      date: new Date(date),
      subTotal,
      supervisorId: req.user.userId,
      supervisorName: req.user.name
    });

    await stockEntry.save();
    res.status(201).json({ message: 'Stock entry created successfully', stockEntry });
  } catch (error) {
    console.error('Create stock entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (supervisor can create products)
router.post('/products', async (req, res) => {
  try {
    const { name, qualities, qualityNames } = req.body;
    
    if (!name || !qualities || !qualityNames) {
      return res.status(400).json({ message: 'Product name, qualities, and quality names are required' });
    }

    const product = new Product({
      name,
      description: '',
      qualities,
      qualityNames,
      active: true
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (supervisor can edit products they created)
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, qualities, qualityNames } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    if (qualities !== undefined) product.qualities = qualities;
    if (qualityNames !== undefined) product.qualityNames = qualityNames;

    await product.save();
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
    
    let query = { supervisorId: req.user.userId };
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (employeeId) query.employeeId = employeeId;
    if (productId) query.productId = productId;

    const reports = await QualityEntry.find(query)
      .sort({ date: 1 });

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

module.exports = router; 