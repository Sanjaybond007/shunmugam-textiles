import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h1>Contact Us</h1>
              <p className="lead">
                Get in touch with us for inquiries, quotes, or any questions about our products.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information and Form */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Contact Information */}
            <Col lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h3 className="textile-primary mb-4">Get in Touch</h3>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <FaMapMarkerAlt className="textile-primary me-3" size={20} />
                      <div>
                        <h6 className="mb-1">Address</h6>
                        <p className="text-muted mb-0">
                          123 Textile Street<br />
                          Industrial Area<br />
                          Chennai, Tamil Nadu, India
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <FaPhone className="textile-primary me-3" size={20} />
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <p className="text-muted mb-0">
                          +91-44-12345678<br />
                          +91-44-12345679
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <FaEnvelope className="textile-primary me-3" size={20} />
                      <div>
                        <h6 className="mb-1">Email</h6>
                        <p className="text-muted mb-0">
                          info@shunmugamtextiles.com<br />
                          sales@shunmugamtextiles.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <FaClock className="textile-primary me-3" size={20} />
                      <div>
                        <h6 className="mb-1">Business Hours</h6>
                        <p className="text-muted mb-0">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Form */}
            <Col lg={8}>
              <Card className="form-container">
                <Card.Body>
                  <h3 className="textile-primary mb-4">Send us a Message</h3>
                  
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                      Thank you for your message! We will get back to you soon.
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your inquiry or requirements..."
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="btn-textile"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="textile-primary">Find Us</h2>
              <p className="text-muted">Visit our manufacturing facility</p>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card>
                <Card.Body className="p-0">
                  <div style={{ height: '400px', backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-center">
                        <FaMapMarkerAlt size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">Interactive Map</h5>
                        <p className="text-muted">
                          Map integration can be added here<br />
                          Coordinates: 13.0827° N, 80.2707° E
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Frequently Asked Questions</h2>
              <p className="text-muted">Common questions about our products and services</p>
            </Col>
          </Row>
          
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="textile-primary">What types of fabrics do you manufacture?</h5>
                  <p className="text-muted">
                    We manufacture a wide range of fabrics including cotton, silk, wool, and synthetic materials. 
                    Each type is available in various qualities and specifications.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="textile-primary">Do you offer custom manufacturing?</h5>
                  <p className="text-muted">
                    Yes, we provide custom manufacturing services for specific requirements. 
                    Contact us with your specifications for a detailed quote.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="textile-primary">What is your minimum order quantity?</h5>
                  <p className="text-muted">
                    Minimum order quantities vary by product type and specifications. 
                    Please contact us for specific details based on your requirements.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="textile-primary">Do you ship internationally?</h5>
                  <p className="text-muted">
                    Yes, we ship our products worldwide. We have established logistics 
                    partnerships to ensure timely and secure delivery to our global customers.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact; 