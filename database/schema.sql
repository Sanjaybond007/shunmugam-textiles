-- Shunmugam Textiles Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS shunmugam_textiles;
USE shunmugam_textiles;

-- Users table (Admin and Supervisors)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'supervisor') NOT NULL DEFAULT 'supervisor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    photo VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    qualities INT DEFAULT 4,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quality entries table
CREATE TABLE quality_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(100) UNIQUE NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    q1 INT DEFAULT 0,
    q2 INT DEFAULT 0,
    q3 INT DEFAULT 0,
    q4 INT DEFAULT 0,
    supervisor_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Gallery table
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company information table
CREATE TABLE company_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    mission TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (user_id, name, password, role) VALUES 
('admin', 'Administrator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample products
INSERT INTO products (name, qualities) VALUES 
('Cotton Fabric', 4),
('Silk Fabric', 4),
('Wool Fabric', 4),
('Synthetic Fabric', 4);

-- Insert sample company info
INSERT INTO company_info (name, description, mission, address, phone, email, website) VALUES 
('Shunmugam Textiles', 
 'Leading textile manufacturer with over 20 years of experience in producing high-quality fabrics for global markets.',
 'To provide the highest quality textiles while maintaining sustainable practices and supporting our local community.',
 '123 Textile Street, Industrial Area, Chennai, Tamil Nadu, India',
 '+91-44-12345678',
 'info@shunmugamtextiles.com',
 'www.shunmugamtextiles.com');

-- Create indexes for better performance
CREATE INDEX idx_quality_entries_employee ON quality_entries(employee_id);
CREATE INDEX idx_quality_entries_product ON quality_entries(product_id);
CREATE INDEX idx_quality_entries_supervisor ON quality_entries(supervisor_id);
CREATE INDEX idx_quality_entries_date ON quality_entries(created_at);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_products_active ON products(active); 