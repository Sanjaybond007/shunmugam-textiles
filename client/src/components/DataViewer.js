import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, 
  InputGroup, Button, Badge, Dropdown, 
  Pagination, Alert, Spinner 
} from 'react-bootstrap';
import { 
  FaSort, FaSortUp, FaSortDown, FaSearch, 
  FaFilter, FaDownload, FaEye, FaEdit, FaTrash,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';

const DataViewer = ({ 
  title, 
  data, 
  columns, 
  loading = false, 
  onEdit, 
  onDelete, 
  onAdd,
  onExport,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  itemsPerPage = 10,
  actions = true
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Sort data
  const sortData = (data, key) => {
    if (!key) return data;
    
    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      // Handle nested properties
      if (key.includes('.')) {
        const keys = key.split('.');
        aVal = keys.reduce((obj, k) => obj?.[k], a);
        bVal = keys.reduce((obj, k) => obj?.[k], b);
      }
      
      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter data
  const filterData = (data) => {
    let filtered = data;
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          let itemVal = item[key];
          if (key.includes('.')) {
            const keys = key.split('.');
            itemVal = keys.reduce((obj, k) => obj?.[k], item);
          }
          return String(itemVal).toLowerCase() === String(value).toLowerCase();
        });
      }
    });
    
    return filtered;
  };

  // Get unique values for filter options
  const getFilterOptions = (key) => {
    const values = data.map(item => {
      let val = item[key];
      if (key.includes('.')) {
        const keys = key.split('.');
        val = keys.reduce((obj, k) => obj?.[k], item);
      }
      return String(val);
    });
    return ['all', ...Array.from(new Set(values))];
  };

  // Pagination
  const totalItems = filterData(data).length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filterData(data).slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const renderCell = (item, column) => {
    let value = item[column.key];
    
    // Handle nested properties
    if (column.key.includes('.')) {
      const keys = column.key.split('.');
      value = keys.reduce((obj, k) => obj?.[k], item);
    }
    
    // Handle special column types
    if (column.type === 'badge') {
      return <Badge bg={column.badgeColor || 'primary'}>{value}</Badge>;
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (column.type === 'array') {
      return Array.isArray(value) ? value.join(', ') : value;
    }
    
    if (column.type === 'object') {
      return JSON.stringify(value);
    }
    
    return value || '-';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading data...</p>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="table-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {title}
              </h5>
              <div className="d-flex gap-2">
                {onAdd && (
                  <Button variant="success" size="sm" onClick={onAdd}>
                    <FaPlus className="me-2" />
                    Add New
                  </Button>
                )}
                {onExport && (
                  <Button variant="info" size="sm" onClick={() => onExport(currentData)}>
                    <FaDownload className="me-2" />
                    Export
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Search and Filters */}
              {(searchable || filterable) && (
                <Row className="mb-4">
                  {searchable && (
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  )}
                  
                  {filterable && (
                    <Col md={6}>
                      <div className="d-flex gap-2 flex-wrap">
                        {columns
                          .filter(col => col.filterable !== false)
                          .map(column => (
                            <Form.Select
                              key={column.key}
                              size="sm"
                              style={{ minWidth: '150px' }}
                              value={selectedFilters[column.key] || 'all'}
                              onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            >
                              <option value="all">{column.title} - All</option>
                              {getFilterOptions(column.key).map(option => (
                                <option key={option} value={option}>
                                  {option === 'all' ? 'All' : option}
                                </option>
                              ))}
                            </Form.Select>
                          ))}
                        <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                          <FaFilter className="me-2" />
                          Clear
                        </Button>
                      </div>
                    </Col>
                  )}
                </Row>
              )}

              {/* Results Summary */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Badge bg="info" className="me-2">
                    Total: {totalItems}
                  </Badge>
                  {totalItems !== data.length && (
                    <Badge bg="warning">
                      Filtered: {totalItems}
                    </Badge>
                  )}
                </div>
                <div className="text-muted">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                </div>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      {columns.map(column => (
                        <th 
                          key={column.key}
                          onClick={() => sortable && column.sortable !== false ? handleSort(column.key) : null}
                          style={{ 
                            cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                            minWidth: column.minWidth || 'auto'
                          }}
                          className={sortable && column.sortable !== false ? 'sortable-header' : ''}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {column.title}
                            {sortable && column.sortable !== false && getSortIcon(column.key)}
                          </div>
                        </th>
                      ))}
                      {actions && (
                        <th style={{ width: '120px' }}>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
                        <tr key={item._id || item.id || index}>
                          {columns.map(column => (
                            <td key={column.key}>
                              {renderCell(item, column)}
                            </td>
                          ))}
                          {actions && (
                            <td>
                              <div className="d-flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => onEdit && onEdit(item)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  onClick={() => onDelete && onDelete(item)}
                                  title="Delete"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                          <div className="text-muted">
                            <FaEye size={32} className="mb-3" />
                            <h6>No data found</h6>
                            <p>Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <Form.Select
                      size="sm"
                      style={{ width: '80px' }}
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Form.Select>
                  </div>
                  
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      disabled={currentPage === 1}
                    />
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                  
                  <div className="text-muted">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DataViewer;

