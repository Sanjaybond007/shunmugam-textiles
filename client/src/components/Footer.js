import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>🧵 Shunmugam Textiles</h5>
            <p className="text-muted">
              Leading textile manufacturer with over 20 years of experience in producing 
              high-quality fabrics for global markets.
            </p>
          </Col>
          <Col md={4}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="/products" className="text-muted text-decoration-none">Products</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Contact Info</h6>
            <ul className="list-unstyled text-muted">
              <li>📍 123 Textile Street, Industrial Area</li>
              <li>Chennai, Tamil Nadu, India</li>
              <li>📞 +91-44-12345678</li>
              <li>✉️ info@shunmugamtextiles.com</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <small className="text-muted">
              © {new Date().getFullYear()} Shunmugam Textiles. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 