import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, ButtonGroup, Nav } from 'react-bootstrap';
import { FaUsers, FaUserTie, FaBoxes, FaChartBar, FaPlus, FaEdit, FaTrash, FaTachometerAlt, FaListAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import cloudinaryService from '../services/cloudinaryService';

const AdminDashboard = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [supervisorReports, setSupervisorReports] = useState([]);
  const [qualityEntries, setQualityEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showQualityEntryModal, setShowQualityEntryModal] = useState(false);
  
  // Editing states
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingQualityEntry, setEditingQualityEntry] = useState(null);
  
  // Form states
  const [supervisorForm, setSupervisorForm] = useState({
    userId: '',
    name: '',
    password: '',
    role: 'supervisor'
  });

  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    name: '',
    supervisorId: '',
    status: 'active'
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    imageURL: '',
    qualities: 4,
    qualityNames: ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4'],
    active: true
  });

  const [qualityEntryForm, setQualityEntryForm] = useState({
    employeeId: '',
    productId: '',
    date: new Date().toISOString().split('T')[0],
    qualities: {},
    subTotal: 0
  });

  // Filters and sorting
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    supervisorId: '',
    productId: '',
    employeeId: ''
  });


  // Image upload states
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [supervisorsRes, employeesRes, productsRes, reportsRes, entriesRes] = await Promise.all([
        authService.api.get('/admin/supervisors'),
        authService.api.get('/admin/employees'),
        authService.api.get('/admin/products'),
        authService.api.get('/admin/supervisor-reports'),
        authService.api.get('/admin/quality-entries')
      ]);

      setSupervisors(Array.isArray(supervisorsRes.data) ? supervisorsRes.data : []);
      setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setSupervisorReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
      setQualityEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Fetch error:', error);
      setSupervisors([]);
      setEmployees([]);
      setProducts([]);
      setSupervisorReports([]);
      setQualityEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupervisor) {
        await authService.api.put(`/admin/supervisors/${editingSupervisor.userId}`, supervisorForm);
        toast.success('Supervisor updated successfully');
      } else {
        await authService.api.post('/admin/supervisors', supervisorForm);
        toast.success('Supervisor created successfully');
      }
      setShowSupervisorModal(false);
      setEditingSupervisor(null);
      setSupervisorForm({ userId: '', name: '', password: '', role: 'supervisor' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save supervisor');
      console.error('Save error:', error);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await authService.api.put(`/admin/employees/${editingEmployee.employeeId}`, employeeForm);
        toast.success('Employee updated successfully');
      } else {
        await authService.api.post('/admin/employees', employeeForm);
        toast.success('Employee created successfully');
      }
      setShowEmployeeModal(false);
      setEditingEmployee(null);
      setEmployeeForm({ employeeId: '', name: '', supervisorId: '', status: 'active' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save employee');
      console.error('Save error:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const productId = editingProduct.id || editingProduct._id;
        await authService.api.put(`/admin/products/${productId}`, productForm);
        toast.success('Product updated successfully');
      } else {
        await authService.api.post('/admin/products', productForm);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', imageURL: '', qualities: 4, qualityNames: ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4'], active: true });
      setImagePreview(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
      console.error('Save error:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    setImageUploading(true);
    try {
      const result = await cloudinaryService.uploadImage(file);
      setProductForm({ ...productForm, imageURL: result.url });
      setImagePreview(result.url);
      toast.success('Image uploaded successfully');
      return result.url;
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to Cloudinary
      handleImageUpload(file);
    }
  };

  const handleQualityEntrySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQualityEntry) {
        await authService.api.put(`/admin/quality-entries/${editingQualityEntry.id}`, qualityEntryForm);
        toast.success('Quality entry updated successfully');
      } else {
        await authService.api.post('/admin/quality-entries', qualityEntryForm);
        toast.success('Quality entry created successfully');
      }
      setShowQualityEntryModal(false);
      setEditingQualityEntry(null);
      setQualityEntryForm({
        employeeId: '',
        productId: '',
        date: new Date().toISOString().split('T')[0],
        qualities: {},
        subTotal: 0
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to save quality entry');
      console.error('Save error:', error);
    }
  };

  const handleEditSupervisor = (supervisor) => {
    setEditingSupervisor(supervisor);
    setSupervisorForm({
      userId: supervisor.userId,
      name: supervisor.name,
      password: '',
      role: supervisor.role
    });
    setShowSupervisorModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      employeeId: employee.employeeId,
      name: employee.name,
      supervisorId: employee.supervisorId,
      status: employee.status
    });
    setShowEmployeeModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      imageURL: product.imageURL || '',
      qualities: product.qualities,
      qualityNames: product.qualityNames,
      active: product.active
    });
    setImagePreview(product.imageURL || null);
    setShowProductModal(true);
  };

  const handleEditQualityEntry = (entry) => {
    setEditingQualityEntry(entry);
    setQualityEntryForm({
      employeeId: entry.employeeId,
      productId: entry.productId,
      date: entry.date,
      qualities: entry.qualities,
      subTotal: entry.subTotal
    });
    setShowQualityEntryModal(true);
  };

  const handleDeleteSupervisor = async (id) => {
    if (window.confirm('Are you sure you want to delete this supervisor?')) {
      try {
        await authService.api.delete(`/admin/supervisors/${id}`);
        toast.success('Supervisor deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete supervisor');
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await authService.api.delete(`/admin/employees/${id}`);
        toast.success('Employee deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete employee');
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await authService.api.delete(`/admin/products/${id}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteQualityEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this quality entry?')) {
      try {
        await authService.api.delete(`/admin/quality-entries/${id}`);
        toast.success('Quality entry deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete quality entry');
        console.error('Delete error:', error);
      }
    }
  };

  const handleQualityChange = (index, value) => {
    const newQualityNames = [...productForm.qualityNames];
    newQualityNames[index] = value;
    setProductForm({ ...productForm, qualityNames: newQualityNames });
  };

  const handleQualitiesCountChange = (count) => {
    const newQualityNames = [];
    for (let i = 0; i < count; i++) {
      newQualityNames[i] = productForm.qualityNames[i] || `Quality ${i + 1}`;
    }
    setProductForm({ ...productForm, qualities: count, qualityNames: newQualityNames });
  };

  const handleQualityValueChange = (qualityName, value) => {
    const newQualities = { ...qualityEntryForm.qualities };
    newQualities[qualityName] = parseFloat(value) || 0;
    
    // Calculate subtotal
    const subTotal = Object.values(newQualities).reduce((sum, val) => sum + val, 0);
    
    setQualityEntryForm({
      ...qualityEntryForm,
      qualities: newQualities,
      subTotal
    });
  };


  const filteredQualityEntries = qualityEntries.filter(entry => {
    if (filters.fromDate && new Date(entry.date) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(entry.date) > new Date(filters.toDate)) return false;
    if (filters.supervisorId && entry.supervisorId !== filters.supervisorId) return false;
    if (filters.productId && entry.productId !== filters.productId) return false;
    if (filters.employeeId && entry.employeeId !== filters.employeeId) return false;
    return true;
  });


  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.name : 'N/A';
  };

  const getProductName = (productId) => {
    const product = products.find(prod => prod._id === productId);
    return product ? product.name : 'N/A';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title fade-in">Admin Dashboard</h1>
        <p className="text-muted mb-0">Manage your textile business operations</p>
      </div>
      
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-3">Admin Dashboard</h2>
            <p className="text-muted">Manage supervisors, weavers (employees), products, and quality entries</p>
          </Col>
        </Row>

        {/* Tab Navigation */}
        <Row className="mb-4">
          <Col>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="dashboard">
                <FaTachometerAlt className="me-2" />
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="supervisors">
                <FaUserTie className="me-2" />
                Supervisors
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="employees">
                <FaUsers className="me-2" />
                Weavers (Employees)
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="products">
                <FaBoxes className="me-2" />
                Products
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="quality-entries">
                <FaListAlt className="me-2" />
                Quality Entries
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reports">
                <FaChartBar className="me-2" />
                Reports
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <Row className="mb-4 fade-in">
              <Col md={3} className="mb-3">
                <div className="stats-card hover-lift">
                  <div className="stats-card-icon">👔</div>
                  <div className="stats-card-value">{supervisors.length}</div>
                  <div className="stats-card-label">Supervisors</div>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="stats-card hover-lift">
                  <div className="stats-card-icon">👥</div>
                  <div className="stats-card-value">{employees.length}</div>
                  <div className="stats-card-label">Weavers</div>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="stats-card hover-lift">
                  <div className="stats-card-icon">📦</div>
                  <div className="stats-card-value">{products.length}</div>
                  <div className="stats-card-label">Products</div>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="stats-card hover-lift">
                  <div className="stats-card-icon">📋</div>
                  <div className="stats-card-value">{qualityEntries.length}</div>
                  <div className="stats-card-label">Quality Entries</div>
                </div>
              </Col>
            </Row>
          )}

          {/* Supervisors Management */}
          {activeTab === 'supervisors' && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Supervisors Management</h5>
                    <Button variant="primary" onClick={() => setShowSupervisorModal(true)}>
                      <FaPlus className="me-2" />
                      Add Supervisor
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supervisors.map((supervisor) => (
                          <tr key={supervisor.id || supervisor.userId}>
                            <td>{supervisor.userId}</td>
                            <td>{supervisor.name}</td>
                            <td>
                              <Badge bg="primary">{supervisor.role}</Badge>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button variant="outline-primary" onClick={() => handleEditSupervisor(supervisor)}>
                                  <FaEdit />
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteSupervisor(supervisor.userId)}>
                                  <FaTrash />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Employees (Weavers) Management */}
          {activeTab === 'employees' && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Weavers (Employees) Management</h5>
                    <Button variant="primary" onClick={() => setShowEmployeeModal(true)}>
                      <FaPlus className="me-2" />
                      Add Weaver
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Supervisor</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id || employee.employeeId}>
                            <td>{employee.employeeId}</td>
                            <td>{employee.name}</td>
                            <td>{employee.supervisorName || 'N/A'}</td>
                            <td>
                              <Badge bg={employee.status === 'active' ? 'success' : 'secondary'}>
                                {employee.status}
                              </Badge>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button variant="outline-primary" onClick={() => handleEditEmployee(employee)}>
                                  <FaEdit />
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteEmployee(employee.employeeId)}>
                                  <FaTrash />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Products Management */}
          {activeTab === 'products' && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Products Management</h5>
                    <Button variant="primary" onClick={() => setShowProductModal(true)}>
                      <FaPlus className="me-2" />
                      Add Product
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Description</th>
                          <th>Qualities</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id || product._id}>
                            <td>
                              {product.imageURL ? (
                                <img 
                                  src={product.imageURL} 
                                  alt={product.name}
                                  style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : null}
                              {!product.imageURL && (
                                <div 
                                  style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    border: '1px solid #dee2e6'
                                  }}
                                >
                                  📦
                                </div>
                              )}
                            </td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>
                              <Badge bg="info">{product.qualities}</Badge>
                            </td>
                            <td>
                              <Badge bg={product.active ? 'success' : 'secondary'}>
                                {product.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button variant="outline-primary" onClick={() => handleEditProduct(product)}>
                                  <FaEdit />
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteProduct(product.id || product._id)}>
                                  <FaTrash />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Quality Entries Management */}
          {activeTab === 'quality-entries' && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Quality Entries Management</h5>
                    <Button variant="primary" onClick={() => setShowQualityEntryModal(true)}>
                      <FaPlus className="me-2" />
                      Add Quality Entry
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Employee</th>
                          <th>Product</th>
                          <th>Qualities</th>
                          <th>Sub Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualityEntries.map((entry) => (
                          <tr key={entry.id}>
                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                            <td>{getEmployeeName(entry.employeeId)}</td>
                            <td>{getProductName(entry.productId)}</td>
                            <td>
                              <div className="small">
                                {Object.entries(entry.qualities).map(([quality, value]) => (
                                  <div key={quality}>{quality}: {value}</div>
                                ))}
                              </div>
                            </td>
                            <td>{entry.subTotal}</td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button variant="outline-primary" onClick={() => handleEditQualityEntry(entry)}>
                                  <FaEdit />
                              </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteQualityEntry(entry.id)}>
                                  <FaTrash />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Reports Section */}
          {activeTab === 'reports' && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Date to Date Reports</h5>
                  </Card.Header>
                  <Card.Body>
                    {/* Date Range Filters */}
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>From Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>To Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Supervisor</Form.Label>
                          <Form.Select
                            value={filters.supervisorId}
                            onChange={(e) => setFilters({...filters, supervisorId: e.target.value})}
                          >
                            <option value="">All Supervisors</option>
                            {supervisors.map(s => (
                              <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Product</Form.Label>
                          <Form.Select
                            value={filters.productId}
                            onChange={(e) => setFilters({...filters, productId: e.target.value})}
                          >
                            <option value="">All Products</option>
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Date to Date Report Table */}
                    <Table responsive striped hover className="mt-4">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Employee Id</th>
                          <th>Employee Name</th>
                          {products.length > 0 && products[0]?.qualityNames?.map((quality, index) => (
                            <th key={index}>{quality}</th>
                          ))}
                          <th>Sub Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQualityEntries.map((entry, index) => (
                          <tr key={entry._id}>
                            <td>{index + 1}</td>
                            <td>{getEmployeeName(entry.employeeId)}</td>
                            <td>{getEmployeeName(entry.employeeId)}</td>
                            {products.length > 0 && products[0]?.qualityNames?.map((quality, qIndex) => (
                              <td key={qIndex}>{entry.qualities[quality] || 0}</td>
                            ))}
                            <td>{entry.subTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
      {/* Modals */}
      {/* Supervisor Modal */}
      <Modal show={showSupervisorModal} onHide={() => setShowSupervisorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSupervisor ? 'Edit Supervisor' : 'Add New Supervisor'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSupervisorSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                value={supervisorForm.userId}
                onChange={(e) => setSupervisorForm({...supervisorForm, userId: e.target.value})}
                required
                disabled={!!editingSupervisor}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={supervisorForm.name}
                onChange={(e) => setSupervisorForm({...supervisorForm, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={supervisorForm.password}
                onChange={(e) => setSupervisorForm({...supervisorForm, password: e.target.value})}
                required={!editingSupervisor}
                placeholder={editingSupervisor ? 'Leave blank to keep current password' : 'Enter password'}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSupervisorModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSupervisor ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Employee Modal */}
      <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEmployee ? 'Edit Weaver' : 'Add New Weaver'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEmployeeSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                value={employeeForm.employeeId}
                onChange={(e) => setEmployeeForm({...employeeForm, employeeId: e.target.value})}
                required
                disabled={!!editingEmployee}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Supervisor</Form.Label>
              <Form.Select
                value={employeeForm.supervisorId}
                onChange={(e) => setEmployeeForm({...employeeForm, supervisorId: e.target.value})}
                required
              >
                <option value="">Select Supervisor</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id || supervisor.userId} value={supervisor.userId}>
                    {supervisor.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={employeeForm.status}
                onChange={(e) => setEmployeeForm({...employeeForm, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmployeeModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingEmployee ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProductSubmit}>
          <Modal.Body>
                <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageUploading}
              />
              {imageUploading && (
                <div className="mt-2">
                  <span className="loading-spinner me-2"></span>
                  Uploading image...
                </div>
              )}
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid var(--border-color)'
                    }} 
                  />
                </div>
              )}
            </Form.Group>
            
                <Form.Group className="mb-3">
                  <Form.Label>Number of Qualities</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="10"
                value={productForm.qualities}
                onChange={(e) => handleQualitiesCountChange(parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quality Names</Form.Label>
              {Array.from({ length: productForm.qualities }, (_, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  className="mb-2"
                  value={productForm.qualityNames[index] || ''}
                  onChange={(e) => handleQualityChange(index, e.target.value)}
                  placeholder={`Quality ${index + 1}`}
                  required
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={productForm.active}
                onChange={(e) => setProductForm({...productForm, active: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quality Entry Modal */}
      <Modal show={showQualityEntryModal} onHide={() => setShowQualityEntryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingQualityEntry ? 'Edit Quality Entry' : 'Add New Quality Entry'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleQualityEntrySubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
            <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
              <Form.Select
                    value={qualityEntryForm.employeeId}
                    onChange={(e) => setQualityEntryForm({...qualityEntryForm, employeeId: e.target.value})}
                required
              >
                    <option value="">Select Employee</option>
                {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                    {employee.employeeId} - {employee.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product</Form.Label>
                  <Form.Select
                    value={qualityEntryForm.productId}
                    onChange={(e) => setQualityEntryForm({...qualityEntryForm, productId: e.target.value})}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={qualityEntryForm.date}
                onChange={(e) => setQualityEntryForm({...qualityEntryForm, date: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quality Values</Form.Label>
              {products.find(p => p._id === qualityEntryForm.productId)?.qualityNames?.map((qualityName, index) => (
                  <Form.Control
                  key={index}
                    type="number"
                  className="mb-2"
                    placeholder={`Enter value for ${qualityName}`}
                  value={qualityEntryForm.qualities[qualityName] || ''}
                  onChange={(e) => handleQualityValueChange(qualityName, e.target.value)}
                  step="0.01"
                  min="0"
                />
              )) || <p className="text-muted">Select a product to see quality fields</p>}
                </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sub Total</Form.Label>
              <Form.Control
                type="number"
                value={qualityEntryForm.subTotal}
                readOnly
                className="bg-light"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQualityEntryModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingQualityEntry ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboard; 