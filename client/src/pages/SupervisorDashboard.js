import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Dropdown } from 'react-bootstrap';
import { FaFileExcel, FaFilter, FaCog, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const SupervisorDashboard = () => {
  console.log('🔄 SupervisorDashboard v2.0 component loaded');
  
  const [reports, setReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    employeeId: '',
    productId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, productsRes, reportsRes] = await Promise.all([
        authService.api.get('/supervisor/employees'),
        authService.api.get('/supervisor/products'),
        authService.api.get('/supervisor/reports')
      ]);

      setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Fetch error:', error);
      
      setEmployees([]);
      setProducts([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      employeeId: '',
      productId: ''
    });
  };

  // Report generation
  const generateExcelReport = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await authService.api.get(`/supervisor/reports/excel?${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'supervisor_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Excel report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate Excel report');
    }
  };

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.fromDate && new Date(report.date) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(report.date) > new Date(filters.toDate)) return false;
    if (filters.employeeId && report.employeeId !== filters.employeeId) return false;
    if (filters.productId && report.productId !== filters.productId) return false;
    return true;
  });

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
    <Container fluid className="py-4" key="supervisor-dashboard-v2">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FaChartBar size={24} className="text-primary me-2" />
              <h4 className="mb-0 text-primary">Supervisor Dashboard v2.0</h4>
            </div>
            <div className="text-muted small">
              Supervisor Reports
            </div>
          </div>
        </Col>
      </Row>

      {/* Report Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaFilter className="text-muted me-2" />
                <h6 className="mb-0">Report Filters</h6>
                <div className="ms-auto">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <FaCog className="me-1" />
                      Filter Options
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={clearFilters}>Clear All Filters</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Export Settings</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">From Date</Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">To Date</Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">Employee</Form.Label>
                    <Form.Select
                      size="sm"
                      value={filters.employeeId}
                      onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                    >
                      <option value="">All Employees</option>
                      {employees.map(employee => (
                        <option key={employee.employeeId} value={employee.employeeId}>
                          {employee.employeeId} - {employee.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">Product</Form.Label>
                    <Form.Select
                      size="sm"
                      value={filters.productId}
                      onChange={(e) => handleFilterChange('productId', e.target.value)}
                    >
                      <option value="">All Products</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Supervisor Reports */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Supervisor Reports</h6>
              <Button 
                variant="success" 
                size="sm"
                onClick={generateExcelReport}
              >
                <FaFileExcel className="me-1" />
                Download Excel
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="small text-muted">Receipt No</th>
                    <th className="small text-muted">Supervisor Id</th>
                    <th className="small text-muted">Employee Id</th>
                    <th className="small text-muted">Employee Name</th>
                    <th className="small text-muted">Date</th>
                    <th className="small text-muted">Product 1</th>
                    <th className="small text-muted">Product 2</th>
                    <th className="small text-muted">Product 3</th>
                    <th className="small text-muted">Product 4</th>
                    <th className="small text-muted">Product 5</th>
                    <th className="small text-muted">Product 6</th>
                    <th className="small text-muted">Product 7</th>
                    <th className="small text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                      <tr key={report.id || index}>
                        <td className="small">{report.receiptNo || '-'}</td>
                        <td className="small">{report.supervisorId || '-'}</td>
                        <td className="small">{report.employeeId || '-'}</td>
                        <td className="small">{report.employeeName || '-'}</td>
                        <td className="small">{report.date ? new Date(report.date).toLocaleDateString() : '-'}</td>
                        <td className="small">{report.product1 || '-'}</td>
                        <td className="small">{report.product2 || '-'}</td>
                        <td className="small">{report.product3 || '-'}</td>
                        <td className="small">{report.product4 || '-'}</td>
                        <td className="small">{report.product5 || '-'}</td>
                        <td className="small">{report.product6 || '-'}</td>
                        <td className="small">{report.product7 || '-'}</td>
                        <td className="small"><strong>{report.total || '-'}</strong></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center text-muted py-4">
                        No reports found matching the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SupervisorDashboard; 