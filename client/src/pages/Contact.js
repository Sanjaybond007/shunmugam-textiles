import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {

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

      {/* Contact Information and Map */}
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
                          SHUNMUGAM TEXTILES<br />
                          3-835, VATHIYAR THOTTAM,<br />
                          VALAYAKARANUR POST,<br />
                          KOMARAPALAYAM-638183,<br />
                          Namakkal District, Tamil Nadu, INDIA
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
                          +91-9994140750<br />
                          +91-9842525705<br />
                          +91-9894847874
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
                          shunmugamtextile@gmail.com
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

            {/* Location Map */}
            <Col lg={8}>
              <Card>
                <Card.Body>
                  <h3 className="textile-primary mb-4">Our Location</h3>
                  <div style={{ height: '500px', width: '100%' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.123456789!2d77.72548731534162!3d11.444117095188806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDI2JzM4LjgiTiA3N8KwNDMnMzEuOCJF!5e0!3m2!1sen!2sin!4v1635123456789!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Shunmugam Textiles Location"
                    ></iframe>
                  </div>
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