import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaIndustry, FaUsers, FaChartLine, FaLeaf } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className='text-white'>Welcome to Shunmugam Textiles</h1>
              <p className="lead">
                Leading textile manufacturer with over 20 years of experience in producing
                high-quality fabrics for global markets. Our commitment to excellence and
                sustainable practices sets us apart in the industry.
              </p>
              <div className="mt-4">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  className="btn-textile me-3"
                >
                  View Products
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-light"
                  size="lg"
                >
                  Contact Us
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <img
                  src='/home.jpg'
                  alt="Textile Manufacturing"
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Why Choose Shunmugam Textiles?</h2>
              <p className="text-muted">We deliver excellence in every thread</p>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon">
                    <FaIndustry />
                  </div>
                  <h5>Modern Manufacturing</h5>
                  <p className="text-muted">
                    State-of-the-art facilities with advanced technology for consistent quality.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon">
                    <FaUsers />
                  </div>
                  <h5>Expert Team</h5>
                  <p className="text-muted">
                    Skilled professionals with decades of experience in textile manufacturing.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon">
                    <FaChartLine />
                  </div>
                  <h5>Quality Control</h5>
                  <p className="text-muted">
                    Rigorous quality control processes ensure every product meets our standards.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon">
                    <FaLeaf />
                  </div>
                  <h5>Sustainable Fabrics</h5>
                  <p className="text-muted">
                    Organic cotton, recycled blends, water-saving processes, low-impact chemicals.
                  </p>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* About Preview Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h3 className="textile-primary">About Our Company</h3>
              <p className="lead">
                Founded in 2003, Shunmugam Textiles has grown from a small family business
                to a leading textile manufacturer serving customers worldwide.
              </p>
              <p>
                Our mission is to provide the highest quality textiles while maintaining
                sustainable practices and supporting our local community. We believe in
                innovation, quality, and customer satisfaction.
              </p>
              <Button as={Link} to="/about" variant="outline-primary" className="btn-textile">
                Learn More About Us
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              {/* <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Textile Factory" 
                className="img-fluid rounded"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              /> */}
              <Button as={Link} to="/products" size="lg" className="btn-textile">
                View All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Preview Section */}
      {/* <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Our Products</h2>
              <p className="text-muted">Discover our range of high-quality textiles</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Cotton Fabrics</Card.Title>
                  <Card.Text>
                    Premium cotton fabrics with excellent breathability and comfort.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Silk Fabrics</Card.Title>
                  <Card.Text>
                    Luxurious silk fabrics with natural sheen and smooth texture.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Wool Fabrics</Card.Title>
                  <Card.Text>
                    Warm and durable wool fabrics perfect for winter wear.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          
        </Container>
      </section> */}
      {/* <Container>
        <Row className="text-center mt-4">
            <Col>
              <Button as={Link} to="/products" size="lg" className="btn-textile">
                View All Products
              </Button>
            </Col>
          </Row>
      </Container> */}
    </div>
  );
};

export default Home; 