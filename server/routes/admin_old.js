const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const userService = require('../services/userService');
const employeeService = require('../services/employeeService');
const productService = require('../services/productService');
const qualityEntryService = require('../services/qualityEntryService');
const companyInfoService = require('../services/companyInfoService');
const contactService = require('../services/contactService');
const galleryService = require('../services/galleryService');
const { verifyToken, requireRole } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(verifyToken);
router.use(requireRole('admin'));

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [users, employees, products, entries, contacts, gallery] = await Promise.all([
      userService.getAllUsers(),
      employeeService.getAllEmployees(),
      productService.getAllProducts(),
      qualityEntryService.getAllQualityEntries(),
      contactService.getAllContactSubmissions(),
      galleryService.getAllGalleryItems()
    ]);

    res.json({
      users: users.length,
      employees: employees.length,
      products: products.length,
      entries: entries.length,
      contacts: contacts.length,
      gallery: gallery.length
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supervisors (users with supervisor role)
router.get('/supervisors', async (req, res) => {
  try {
    const supervisors = await userService.getUsersByRole('supervisor');
    res.json(supervisors);
  } catch (error) {
    console.error('Get supervisors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create supervisor (admin can create supervisors)
router.post('/supervisors', async (req, res) => {
  try {
    const { userId, name, password } = req.body;
    
    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await userService.createUser({
      userId,
      name,
      password,
      role: 'supervisor'
    });

    res.status(201).json({ message: 'Supervisor created successfully', user });
  } catch (error) {
    console.error('Create supervisor error:', error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: 'User ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update supervisor
router.put('/supervisors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'Supervisor updated successfully', user });
  } catch (error) {
    console.error('Update supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete supervisor
router.delete('/supervisors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Delete supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Quality entries management
router.get('/quality-entries', async (req, res) => {
  try {
    const { fromDate, toDate, supervisorId, productId, employeeId } = req.query;
    
    let query = {};
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (supervisorId) query.supervisorId = supervisorId;
    if (productId) query.productId = productId;
    if (employeeId) query.employeeId = employeeId;

    const entries = await QualityEntry.find(query)
      .sort({ date: -1 });

    res.json(entries);
  } catch (error) {
    console.error('Get quality entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/quality-entries', async (req, res) => {
  try {
    const { employeeId, productId, date, qualities, supervisorId } = req.body;
    
    if (!employeeId || !productId || !date || !qualities) {
      return res.status(400).json({ message: 'Employee ID, product ID, date, and qualities are required' });
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
      supervisorId: supervisorId || req.user.userId,
      supervisorName: req.user.name || 'Admin'
    });

    await qualityEntry.save();
    res.status(201).json({ message: 'Quality entry created successfully', qualityEntry });
  } catch (error) {
    console.error('Create quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, productId, date, qualities, supervisorId } = req.body;

    const qualityEntry = await QualityEntry.findById(id);
    if (!qualityEntry) {
      return res.status(404).json({ message: 'Quality entry not found' });
    }

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
    if (supervisorId) qualityEntry.supervisorId = supervisorId;

    // Recalculate subtotal
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

router.delete('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const qualityEntry = await QualityEntry.findByIdAndDelete(id);
    
    if (!qualityEntry) {
      return res.status(404).json({ message: 'Quality entry not found' });
    }

    res.json({ message: 'Quality entry deleted successfully' });
  } catch (error) {
    console.error('Delete quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User management routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ userId: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { userId, name, password, role } = req.body;
    
    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const user = new User({ userId, name, password, role: 'supervisor' });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndDelete({ userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Employee management routes
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ employeeId: 1 });
    
    // Get all supervisors for reference
    const supervisors = await User.find({ role: 'supervisor' });
    
    // Add supervisor names to employees
    const employeesWithSupervisor = employees.map(employee => {
      const employeeObj = employee.toObject();
      if (employee.supervisorId) {
        const supervisor = supervisors.find(s => s.userId === employee.supervisorId);
        employeeObj.supervisorName = supervisor ? supervisor.name : 'N/A';
      } else {
        employeeObj.supervisorName = 'Not Assigned';
      }
      return employeeObj;
    });
    
    res.json(employeesWithSupervisor);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const { employeeId, name, status, supervisorId } = req.body;
    
    if (!employeeId || !name) {
      return res.status(400).json({ message: 'Employee ID and name are required' });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const employee = new Employee({ 
      employeeId, 
      name, 
      status: status || 'active',
      supervisorId: supervisorId || null
    });
    await employee.save();

    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, supervisorId } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.name = name;
    if (status) employee.status = status;
    if (supervisorId !== undefined) employee.supervisorId = supervisorId;

    await employee.save();
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product management routes
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, description, qualities, qualityNames, active } = req.body;
    
    if (!name || !qualities || !qualityNames) {
      return res.status(400).json({ message: 'Product name, qualities, and quality names are required' });
    }

    const product = new Product({
      name,
      description: description || '',
      qualities,
      qualityNames,
      active: active !== undefined ? active : true
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, qualities, qualityNames, active } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    if (description !== undefined) product.description = description;
    if (qualities !== undefined) product.qualities = qualities;
    if (qualityNames !== undefined) product.qualityNames = qualityNames;
    if (active !== undefined) product.active = active;

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Founder management routes
router.get('/founders', async (req, res) => {
  try {
    const founders = await Founder.find().sort({ order: 1, name: 1 });
    res.json(founders);
  } catch (error) {
    console.error('Get founders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/founders', async (req, res) => {
  try {
    const { name, position, bio, email, linkedin, order, active } = req.body;
    
    if (!name || !position || !bio) {
      return res.status(400).json({ message: 'Name, position, and bio are required' });
    }

    const founder = new Founder({
      name,
      position,
      bio,
      email: email || '',
      linkedin: linkedin || '',
      order: order || 0,
      active: active !== undefined ? active : true
    });

    await founder.save();
    res.status(201).json({ message: 'Founder created successfully', founder });
  } catch (error) {
    console.error('Create founder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/founders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, email, linkedin, order, active } = req.body;

    const founder = await Founder.findById(id);
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }

    founder.name = name;
    founder.position = position;
    founder.bio = bio;
    if (email !== undefined) founder.email = email;
    if (linkedin !== undefined) founder.linkedin = linkedin;
    if (order !== undefined) founder.order = order;
    if (active !== undefined) founder.active = active;

    await founder.save();
    res.json({ message: 'Founder updated successfully', founder });
  } catch (error) {
    console.error('Update founder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/founders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const founder = await Founder.findByIdAndDelete(id);
    
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }

    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    console.error('Delete founder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stock management routes
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
      supervisorName: req.user.name || 'Admin'
    });

    await stockEntry.save();
    res.status(201).json({ message: 'Stock entry created successfully', stockEntry });
  } catch (error) {
    console.error('Create stock entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Supervisor reports
router.get('/supervisor-reports', async (req, res) => {
  try {
    const { fromDate, toDate, supervisorId, productId, employeeId } = req.query;
    
    let query = {};
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (supervisorId) query.supervisorId = supervisorId;
    if (productId) query.productId = productId;
    if (employeeId) query.employeeId = employeeId;

    const reports = await QualityEntry.find(query)
      .sort({ date: -1 });

    const formattedReports = reports.map(report => ({
      _id: report._id,
      employeeId: report.employeeId,
      employeeName: report.employeeName,
      productId: report.productId,
      productName: report.productName,
      date: report.date,
      qualities: report.qualities,
      subTotal: report.subTotal,
      supervisorId: report.supervisorId,
      supervisorName: report.supervisorName
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/supervisor-reports/export', async (req, res) => {
  try {
    const { fromDate, toDate, supervisorId, productId } = req.query;
    
    let query = {};
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    if (supervisorId) query.supervisorId = supervisorId;
    if (productId) query.productId = productId;

    const reports = await QualityEntry.find(query)
      .populate('employeeId', 'name')
      .populate('productId', 'name')
      .sort({ date: 1 });

    // For now, return JSON. In production, you'd generate Excel file
    res.json({
      message: 'Export functionality to be implemented',
      reports: reports.length,
      filters: { fromDate, toDate, supervisorId, productId }
    });
  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 