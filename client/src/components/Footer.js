import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/logo.jpg" 
                alt="Shunmugam Textiles Logo" 
                style={{ height: '30px', width: 'auto' }}
                className="me-2"
              />
              <h5 className="mb-0 text-light">Shunmugam Textiles</h5>
            </div>
            <p className="text-light">
              Leading textile manufacturer with over 20 years of experience in producing 
              high-quality fabrics for global markets.
            </p>
          </Col>
          <Col md={4}>
            <h6 className="text-light">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/products" className="text-light text-decoration-none">Products</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="text-light">Contact Info</h6>
            <ul className="list-unstyled text-light">
              <li>📍 SHUNMUGAM TEXTILES</li>
              <li>3-835, VATHIYAR THOTTAM, VALAYAKARANUR POST</li>
              <li>KOMARAPALAYAM-638183, Namakkal District, Tamil Nadu, INDIA</li>
              <li>📞 +91-9994140750 / +91-9842525705 / +91-9894847874</li>
              <li>✉️ shunmugamtextile@gmail.com</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <small className="text-light">
              © {new Date().getFullYear()} Shunmugam Textiles. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 