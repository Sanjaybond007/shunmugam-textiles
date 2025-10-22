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
router.put('/supervisors/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = password;

    const user = await userService.updateUser(userId, updateData, 'supervisor');
    if (!user) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor updated successfully', user });
  } catch (error) {
    console.error('Update supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete supervisor
router.delete('/supervisors/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await userService.deleteUser(userId, 'supervisor');
    if (!deleted) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Delete supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Weaver management routes
router.get('/weavers', async (req, res) => {
  try {
    const weavers = await userService.getUsersByRole('weaver');
    res.json(weavers);
  } catch (error) {
    console.error('Get weavers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/weavers', async (req, res) => {
  try {
    const { userId, name, password } = req.body;
    
    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await userService.createUser({
      userId,
      name,
      password,
      role: 'weaver'
    });

    res.status(201).json({ message: 'Weaver created successfully', user });
  } catch (error) {
    console.error('Create weaver error:', error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: 'User ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/weavers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = password;

    const user = await userService.updateUser(userId, updateData, 'weaver');
    if (!user) {
      return res.status(404).json({ message: 'Weaver not found' });
    }

    res.json({ message: 'Weaver updated successfully', user });
  } catch (error) {
    console.error('Update weaver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/weavers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await userService.deleteUser(userId, 'weaver');
    if (!deleted) {
      return res.status(404).json({ message: 'Weaver not found' });
    }

    res.json({ message: 'Weaver deleted successfully' });
  } catch (error) {
    console.error('Delete weaver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin management routes
router.get('/admins', async (req, res) => {
  try {
    const admins = await userService.getUsersByRole('admin');
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admins', async (req, res) => {
  try {
    const { userId, name, password } = req.body;
    
    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await userService.createUser({
      userId,
      name,
      password,
      role: 'admin'
    });

    res.status(201).json({ message: 'Admin created successfully', user });
  } catch (error) {
    console.error('Create admin error:', error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: 'User ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/admins/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = password;

    const user = await userService.updateUser(userId, updateData, 'admin');
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin updated successfully', user });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admins/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await userService.deleteUser(userId, 'admin');
    if (!deleted) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Employee management routes
router.get('/employees', async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    
    // Add supervisor names to employees
    const employeesWithSupervisorNames = await Promise.all(
      employees.map(async (employee) => {
        if (employee.supervisorId) {
          try {
            const supervisor = await userService.findByUserId(employee.supervisorId, 'supervisor');
            return {
              ...employee,
              supervisorName: supervisor ? supervisor.name : `Unknown (${employee.supervisorId})`
            };
          } catch (error) {
            console.error(`Error finding supervisor ${employee.supervisorId}:`, error);
            return {
              ...employee,
              supervisorName: `Error (${employee.supervisorId})`
            };
          }
        }
        return {
          ...employee,
          supervisorName: 'No Supervisor'
        };
      })
    );
    
    res.json(employeesWithSupervisorNames);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const { employeeId, name, photo, status, supervisorId } = req.body;
    
    if (!employeeId || !name) {
      return res.status(400).json({ message: 'Employee ID and name are required' });
    }

    const employee = await employeeService.createEmployee({
      employeeId,
      name,
      photo,
      status,
      supervisorId
    });

    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.message === 'Employee already exists') {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/employees/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, photo, status, supervisorId } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (photo !== undefined) updateData.photo = photo;
    if (status) updateData.status = status;
    if (supervisorId !== undefined) updateData.supervisorId = supervisorId;

    const employee = await employeeService.updateEmployee(employeeId, updateData);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/employees/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const deleted = await employeeService.deleteEmployee(employeeId);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees by supervisor
router.get('/employees/supervisor/:supervisorId', async (req, res) => {
  try {
    const { supervisorId } = req.params;
    const employees = await employeeService.getEmployeesBySupervisor(supervisorId);
    res.json(employees);
  } catch (error) {
    console.error('Get employees by supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product management routes
router.get('/products', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, description, imageURL, qualities, qualityNames, active } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const product = await productService.createProduct({
      name,
      description,
      imageURL,
      qualities,
      qualityNames,
      active
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageURL, qualities, qualityNames, active } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (imageURL !== undefined) updateData.imageURL = imageURL;
    if (qualities !== undefined) updateData.qualities = qualities;
    if (qualityNames !== undefined) updateData.qualityNames = qualityNames;
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

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Quality entries management
router.get('/quality-entries', async (req, res) => {
  try {
    const { employeeId, productId, startDate, endDate } = req.query;
    
    let entries;
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      entries = await qualityEntryService.getQualityEntriesByDateRange(start, end, {
        employeeId,
        productId
      });
    } else {
      const filters = {};
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

router.put('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const qualityEntry = await qualityEntryService.updateQualityEntry(id, updateData);
    if (!qualityEntry) {
      return res.status(404).json({ message: 'Quality entry not found' });
    }

    res.json({ message: 'Quality entry updated successfully', qualityEntry });
  } catch (error) {
    console.error('Update quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/quality-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await qualityEntryService.deleteQualityEntry(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Quality entry not found' });
    }

    res.json({ message: 'Quality entry deleted successfully' });
  } catch (error) {
    console.error('Delete quality entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Company info management
router.get('/company-info', async (req, res) => {
  try {
    const companyInfo = await companyInfoService.getCompanyInfo();
    res.json(companyInfo);
  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/company-info', async (req, res) => {
  try {
    const updateData = req.body;
    const companyInfo = await companyInfoService.updateCompanyInfo(updateData);
    res.json({ message: 'Company info updated successfully', companyInfo });
  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact submissions management
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await contactService.getAllContactSubmissions();
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await contactService.deleteContactSubmission(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gallery management
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await galleryService.getAllGalleryItems();
    res.json(gallery);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await galleryService.deleteGalleryItem(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reports and analytics
router.get('/reports/quality-stats', async (req, res) => {
  try {
    const { employeeId, productId, startDate, endDate } = req.query;
    
    const filters = {};
    if (employeeId) filters.employeeId = employeeId;
    if (productId) filters.productId = productId;
    
    const stats = await qualityEntryService.getQualityStats(filters);
    res.json(stats);
  } catch (error) {
    console.error('Get quality stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/reports/employee-production/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const stats = await qualityEntryService.getEmployeeProductionStats(employeeId, start, end);
    res.json(stats);
  } catch (error) {
    console.error('Get employee production stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/reports/product-production/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const stats = await qualityEntryService.getProductProductionStats(productId, start, end);
    res.json(stats);
  } catch (error) {
    console.error('Get product production stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Supervisor reports endpoint
router.get('/supervisor-reports', async (req, res) => {
  try {
    // Get all supervisors
    const supervisors = await userService.getUsersByRole('supervisor');
    
    // Return basic supervisor info without complex queries for now
    // This avoids the Firestore index requirement
    const supervisorReports = supervisors.map(supervisor => ({
      ...supervisor,
      totalEntries: 0,
      recentEntries: [],
      lastActivity: null
    }));
    
    res.json(supervisorReports);
  } catch (error) {
    console.error('Get supervisor reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
