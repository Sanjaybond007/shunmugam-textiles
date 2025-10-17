import React, { useState } from 'react';
import { Nav, Badge } from 'react-bootstrap';
import { 
  FaTachometerAlt, FaUsers, FaUserTie, FaBoxes, 
  FaChartBar, FaCog, FaSignOutAlt, FaPlus,
  FaClipboardList, FaDatabase
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = ({ userRole, stats, onSectionChange, activeSection }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSectionClick = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const adminMenuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <FaTachometerAlt />,
      badge: null
    },
    {
      key: 'users',
      title: 'Supervisors',
      icon: <FaUsers />,
      badge: stats?.users || 0
    },
    {
      key: 'employees',
      title: 'Employees',
      icon: <FaUserTie />,
      badge: stats?.employees || 0
    },
    {
      key: 'products',
      title: 'Products',
      icon: <FaBoxes />,
      badge: stats?.products || 0
    },
    {
      key: 'stock',
      title: 'Stock Entries',
      icon: <FaDatabase />,
      badge: stats?.entries || 0
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: <FaChartBar />,
      badge: stats?.reports || 0
    }
  ];

  const supervisorMenuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <FaTachometerAlt />,
      badge: null
    },
    {
      key: 'stock',
      title: 'Stock Management',
      icon: <FaDatabase />,
      badge: stats?.stockEntries || 0
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: <FaChartBar />,
      badge: stats?.reports || 0
    }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : supervisorMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FaTachometerAlt size={20} />
          <span className="logo-text">
            {userRole === 'admin' ? 'Admin' : 'Supervisor'}
          </span>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            <FaUsers size={16} />
          </div>
          <div className="user-details">
            <div className="user-name">{userRole === 'admin' ? 'Admin' : 'Supervisor'}</div>
            <div className="user-role">
              <Badge bg={userRole === 'admin' ? 'danger' : 'primary'} size="sm">
                {userRole.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.key}
              className={`menu-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => handleSectionClick(item.key)}
            >
              <div className="menu-icon">
                {item.icon}
              </div>
              <div className="menu-content">
                <span className="menu-title">{item.title}</span>
                {item.badge !== null && (
                  <Badge bg="light" text="dark" className="menu-badge">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <div className="sidebar-footer">
        <Nav.Link className="logout-item" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;
