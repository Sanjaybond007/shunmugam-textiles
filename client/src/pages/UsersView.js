import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import DataViewer from '../components/DataViewer';
import Sidebar from '../components/Sidebar';

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    role: 'user',
    email: '',
    password: ''
  });

  // Column definitions for DataViewer
  const columns = [
    {
      key: 'userId',
      title: 'User ID',
      sortable: true,
      filterable: true,
      minWidth: '120px'
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterable: true,
      minWidth: '150px'
    },
    {
      key: 'role',
      title: 'Role',
      type: 'badge',
      badgeColor: 'primary',
      sortable: true,
      filterable: true,
      minWidth: '100px'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      filterable: true,
      minWidth: '200px'
    },
    {
      key: 'createdAt',
      title: 'Created Date',
      type: 'date',
      sortable: true,
      filterable: true,
      minWidth: '120px'
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      type: 'date',
      sortable: true,
      filterable: true,
      minWidth: '120px'
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.api.get('/admin/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      userId: '',
      name: '',
      role: 'user',
      email: '',
      password: ''
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      userId: user.userId,
      name: user.name,
      role: user.role,
      email: user.email || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await authService.api.delete(`/admin/users/${user.userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await authService.api.put(`/admin/users/${editingUser.userId}`, formData);
        toast.success('User updated successfully');
      } else {
        await authService.api.post('/admin/users', formData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleExport = (data) => {
    // Simple CSV export
    const csvContent = [
      ['User ID', 'Name', 'Role', 'Email', 'Created Date'],
      ...data.map(user => [
        user.userId,
        user.name,
        user.role,
        user.email || '',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Users exported successfully');
  };

  return (
    <div className="d-flex">
      <Sidebar userRole="admin" />
      <div className="main-content-with-sidebar">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center">
                <FaUsers size={32} className="text-primary me-3" />
                <div>
                  <h2 className="text-primary mb-1">Users Management</h2>
                  <p className="text-muted mb-0">View, sort, and manage all system users</p>
                </div>
              </div>
            </Col>
          </Row>

          <DataViewer
            title="System Users"
            data={users}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onExport={handleExport}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            itemsPerPage={15}
            actions={true}
          />
        </Container>

        {/* User Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? 'Edit User' : 'Add New User'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User ID *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.userId}
                      onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      required
                      disabled={!!editingUser}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                    >
                      <option value="user">User</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{editingUser ? 'New Password' : 'Password *'}</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                />
                {editingUser && (
                  <Form.Text className="text-muted">
                    Leave blank to keep the current password
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UsersView;

