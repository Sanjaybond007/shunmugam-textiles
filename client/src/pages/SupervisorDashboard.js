import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FaUsers, FaBoxes, FaChartBar, FaPlus, FaEdit, FaTrash, FaFileExcel, FaFilter, FaSort, FaSortUp, FaSortDown, FaChartLine, FaCog, FaTachometerAlt, FaDatabase } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import Sidebar from '../components/Sidebar';

const SupervisorDashboard = () => {
  const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [supervisorReports, setSupervisorReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showStockModal, setShowStockModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Form states
  const [stockForm, setStockForm] = useState({
    employeeId: '',
    productId: '',
    qualities: {},
    date: new Date().toISOString().split('T')[0]
  });
  
  const [productForm, setProductForm] = useState({
    name: '',
    qualities: 4,
    qualityNames: ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4']
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Filters and sorting
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    employeeId: '',
    productId: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, employeesRes, productsRes, stockRes, reportsRes] = await Promise.all([
        authService.api.get('/supervisor/stats'),
        authService.api.get('/supervisor/employees'),
        authService.api.get('/supervisor/products'),
        authService.api.get('/supervisor/stock-entries'),
        authService.api.get('/supervisor/reports')
      ]);

      setStats(statsRes.data || {});
      setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setStockEntries(Array.isArray(stockRes.data) ? stockRes.data : []);
      setSupervisorReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Fetch error:', error);
      
      setStats({});
      setEmployees([]);
      setProducts([]);
      setStockEntries([]);
      setSupervisorReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Sorting functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data, key) => {
    if (!key) return data;
    
    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aVal = keys.reduce((obj, k) => obj?.[k], a);
        bVal = keys.reduce((obj, k) => obj?.[k], b);
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Stock management
  const openStockModal = () => {
    setStockForm({
      employeeId: '',
      productId: '',
      qualities: {},
      date: new Date().toISOString().split('T')[0]
    });
    setShowStockModal(true);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.api.post('/supervisor/stock', stockForm);
      toast.success('Stock entry added successfully');
      setShowStockModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to add stock entry');
    }
  };

  // Product management
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        qualities: product.qualities,
        qualityNames: product.qualityNames || ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4']
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        qualities: 4,
        qualityNames: ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4']
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await authService.api.put(`/supervisor/products/${editingProduct._id}`, productForm);
        toast.success('Product updated successfully');
      } else {
        await authService.api.post('/supervisor/products', productForm);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', qualities: 4, qualityNames: ['Quality 1', 'Quality 2', 'Quality 3', 'Quality 4'] });
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleQualityChange = (index, value) => {
    const newQualityNames = [...productForm.qualityNames];
    newQualityNames[index] = value;
    setProductForm({ ...productForm, qualityNames: newQualityNames });
  };

  const addQuality = () => {
    if (productForm.qualities < 10) {
      const newQualityNames = [...productForm.qualityNames, `Quality ${productForm.qualities + 1}`];
      setProductForm({
        ...productForm,
        qualities: productForm.qualities + 1,
        qualityNames: newQualityNames
      });
    }
  };

  const removeQuality = () => {
    if (productForm.qualities > 1) {
      const newQualityNames = productForm.qualityNames.slice(0, -1);
      setProductForm({
        ...productForm,
        qualities: productForm.qualities - 1,
        qualityNames: newQualityNames
      });
    }
  };

  // Report generation
  const generateReport = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await authService.api.get(`/supervisor/reports/generate?${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'supervisor_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar userRole="supervisor" stats={stats} />
      
      <div className="main-content-with-sidebar">
        <Container fluid>
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center">
                <FaTachometerAlt size={32} className="text-primary me-3" />
                <div>
                  <h2 className="text-primary mb-1">Supervisor Dashboard</h2>
                  <p className="text-muted mb-0">Manage stock entries, products, and generate reports</p>
                </div>
              </div>
            </Col>
          </Row>

      {/* Welcome Message */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Body className="text-center py-5">
              <FaTachometerAlt size={64} className="text-primary mb-3" />
              <h3 className="text-primary mb-3">Welcome to Supervisor Dashboard</h3>
              <p className="text-muted mb-4">
                Use the right sidebar to navigate and manage stock entries, products, and generate reports.
              </p>
                                <div className="text-muted">
                    <p>All functionalities are available through the organized sidebar menu.</p>
                    <p>Click on any menu item to view, sort, and manage your data.</p>
                  </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stock Entries */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Recent Stock Entries
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                      Date {getSortIcon('date')}
                    </th>
                    <th onClick={() => handleSort('employeeId')} style={{ cursor: 'pointer' }}>
                      Employee {getSortIcon('employeeId')}
                    </th>
                    <th onClick={() => handleSort('productName')} style={{ cursor: 'pointer' }}>
                      Product {getSortIcon('productName')}
                    </th>
                    <th>Quality Values</th>
                    <th onClick={() => handleSort('subTotal')} style={{ cursor: 'pointer' }}>
                      Total {getSortIcon('subTotal')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockEntries.length > 0 ? 
                    sortData(stockEntries, sortConfig.key).slice(0, 10).map((entry, index) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.employeeId}</td>
                      <td>{entry.productName}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {entry.qualities && Object.entries(entry.qualities).map(([key, value]) => (
                            <Badge key={key} bg="secondary" className="small">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{entry.subTotal || 0}</strong>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No stock entries found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Management */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaBoxes className="me-2" />
                Products Management
              </h5>
              <Button size="sm" onClick={() => openProductModal()}>
                <FaPlus className="me-1" />
                Add Product
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Product Name {getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('qualities')} style={{ cursor: 'pointer' }}>
                      Qualities {getSortIcon('qualities')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? 
                    sortData(products, sortConfig.key).map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {product.qualityNames?.map((name, index) => (
                            <Badge key={index} bg="primary" className="small">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openProductModal(product)}>
                          <FaEdit />
                        </Button>
                        <Button size="sm" variant="outline-success" onClick={() => openStockModal()}>
                          <FaChartLine />
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">No products found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stock Entry Modal */}
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Stock Entry</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleStockSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Employee</Form.Label>
                  <Form.Select
                    value={stockForm.employeeId}
                    onChange={(e) => setStockForm({...stockForm, employeeId: e.target.value})}
                    required
                  >
                    <option value="">Choose employee...</option>
                    {employees.map(employee => (
                      <option key={employee.employeeId} value={employee.employeeId}>
                        {employee.employeeId} - {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Product</Form.Label>
                  <Form.Select
                    value={stockForm.productId}
                    onChange={(e) => setStockForm({...stockForm, productId: e.target.value})}
                    required
                  >
                    <option value="">Choose product...</option>
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
                value={stockForm.date}
                onChange={(e) => setStockForm({...stockForm, date: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quality Values</Form.Label>
              {stockForm.productId && products.find(p => p._id === stockForm.productId)?.qualityNames?.map((qualityName, index) => (
                <Form.Group key={index} className="mb-2">
                  <Form.Label>{qualityName}</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Enter value for ${qualityName}`}
                    onChange={(e) => setStockForm({
                      ...stockForm,
                      qualities: {
                        ...stockForm.qualities,
                        [qualityName]: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </Form.Group>
              ))}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStockModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-textile">
              Add Stock Entry
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
              <Form.Label>Number of Qualities</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Button variant="outline-success" size="sm" onClick={addQuality}>
                  <FaPlus />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={removeQuality}>
                  <FaTrash />
                </Button>
              </div>
              <Form.Control
                type="number"
                value={productForm.qualities}
                onChange={(e) => setProductForm({...productForm, qualities: parseInt(e.target.value, 10)})}
                min="1"
                max="10"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quality Names</Form.Label>
              {productForm.qualityNames.map((name, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handleQualityChange(index, e.target.value)}
                  className="mb-2"
                  placeholder={`Quality ${index + 1}`}
                />
              ))}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-textile">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
        </Container>
      </div>
    </div>
  );
};

export default SupervisorDashboard; 