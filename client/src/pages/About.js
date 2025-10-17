import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaIndustry, FaUsers, FaAward, FaGlobe, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const About = () => {
  const [companyInfo, setCompanyInfo] = useState({});
  const [founders, setFounders] = useState([]);

  useEffect(() => {
    fetchCompanyInfo();
    fetchFounders();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/public/company-info');
      const data = await response.json();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Failed to fetch company info:', error);
    }
  };

  const fetchFounders = async () => {
    try {
      const response = await fetch('/api/public/founders');
      const data = await response.json();
      setFounders(data);
    } catch (error) {
      console.error('Failed to fetch founders:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h1>About Shunmugam Textiles</h1>
              <p className="lead">
                Leading textile manufacturer with over 20 years of experience in producing 
                high-quality fabrics for global markets.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Company Information */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8}>
              <h2 className="textile-primary mb-4">Our Story</h2>
              <p className="lead">
                Founded in 2003, Shunmugam Textiles has grown from a small family business 
                to a leading textile manufacturer serving customers worldwide.
              </p>
              <p>
                Our journey began with a simple vision: to create the highest quality textiles 
                while maintaining sustainable practices and supporting our local community. 
                Over the years, we have expanded our operations, invested in modern technology, 
                and built a team of skilled professionals who share our commitment to excellence.
              </p>
              <p>
                Today, we are proud to serve customers across the globe, providing them with 
                premium fabrics that meet the highest standards of quality and durability. 
                Our state-of-the-art manufacturing facilities and rigorous quality control 
                processes ensure that every product we produce meets our exacting standards.
              </p>
            </Col>
            <Col lg={4}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="textile-primary">Quick Facts</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Founded:</strong> 2003
                    </li>
                    <li className="mb-2">
                      <strong>Location:</strong> Chennai, Tamil Nadu, India
                    </li>
                    <li className="mb-2">
                      <strong>Employees:</strong> 500+
                    </li>
                    <li className="mb-2">
                      <strong>Products:</strong> Cotton, Silk, Wool, Synthetic
                    </li>
                    <li className="mb-2">
                      <strong>Certification:</strong> ISO 9001:2015
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Values */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Our Mission & Values</h2>
              <p className="text-muted">Guiding principles that drive our success</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaIndustry />
                  </div>
                  <h5>Quality Excellence</h5>
                  <p className="text-muted">
                    We maintain the highest standards of quality in every aspect of our 
                    manufacturing process, from raw material selection to final product delivery.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaUsers />
                  </div>
                  <h5>Team Excellence</h5>
                  <p className="text-muted">
                    Our skilled team of professionals brings decades of experience and 
                    dedication to every project, ensuring consistent results.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaAward />
                  </div>
                  <h5>Innovation</h5>
                  <p className="text-muted">
                    We continuously invest in modern technology and innovative processes 
                    to stay ahead of industry trends and meet evolving customer needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaGlobe />
                  </div>
                  <h5>Sustainability</h5>
                  <p className="text-muted">
                    We are committed to sustainable practices and environmental responsibility 
                    in all our operations and processes.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Founders/Directors Section */}
      {founders.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="textile-primary">Our Leadership Team</h2>
                <p className="text-muted">Meet the visionaries behind our success</p>
              </Col>
            </Row>
            
            <Row>
              {founders.map((founder) => (
                <Col key={founder._id} lg={4} md={6} className="mb-4">
                  <Card className="h-100 founder-card">
                    <Card.Body className="text-center">
                      <h5 className="textile-primary mb-2">{founder.name}</h5>
                      <p className="text-muted mb-3">{founder.position}</p>
                      <p className="founder-bio">{founder.bio}</p>
                      <div className="founder-links">
                        {founder.email && (
                          <a href={`mailto:${founder.email}`} className="me-3" title="Email">
                            <FaEnvelope />
                          </a>
                        )}
                        {founder.linkedin && (
                          <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <FaLinkedin />
                          </a>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Company Details */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6}>
              <h3 className="textile-primary mb-4">Our Mission</h3>
              <p>
                To provide the highest quality textiles while maintaining sustainable practices 
                and supporting our local community. We believe in innovation, quality, and 
                customer satisfaction.
              </p>
              <p>
                Our mission is to be the preferred choice for textile manufacturing, 
                recognized for our quality, reliability, and commitment to customer success.
              </p>
            </Col>
            <Col lg={6}>
              <h3 className="textile-primary mb-4">Our Vision</h3>
              <p>
                To be a global leader in textile manufacturing, known for innovation, 
                quality, and sustainable practices. We aim to expand our reach while 
                maintaining our commitment to excellence and community development.
              </p>
              <p>
                We envision a future where Shunmugam Textiles is synonymous with quality, 
                reliability, and innovation in the textile industry.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="textile-primary">Get in Touch</h2>
              <p className="text-muted">We'd love to hear from you</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="text-center mb-4">
              <h5>📍 Address</h5>
              <p className="text-muted">
                123 Textile Street<br />
                Industrial Area<br />
                Chennai, Tamil Nadu, India
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <h5>📞 Phone</h5>
              <p className="text-muted">
                +91-44-12345678<br />
                +91-44-12345679
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <h5>✉️ Email</h5>
              <p className="text-muted">
                info@shunmugamtextiles.com<br />
                sales@shunmugamtextiles.com
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About; 