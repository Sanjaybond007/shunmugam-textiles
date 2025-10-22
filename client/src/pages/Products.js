import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaIndustry, FaCheckCircle } from 'react-icons/fa';
import authService from '../services/authService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from backend...');
      const response = await authService.api.get('/public/products');
      console.log('Products response:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h1>Our Products</h1>
              <p className="lead">
                Discover our range of high-quality textiles manufactured with precision 
                and care for global markets.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Grid */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Quality Textiles</h2>
              <p className="text-muted">
                Each product undergoes rigorous quality control to ensure the highest standards
              </p>
            </Col>
          </Row>
          
          {products.length > 0 ? (
            <Row>
              {products.filter(product => product.active).map((product) => (
                <Col lg={6} className="mb-4" key={product.id || product._id}>
                  <Card className="h-100 product-card">
                    {product.imageURL && (
                      <Card.Img 
                        variant="top" 
                        src={product.imageURL} 
                        alt={product.name}
                        style={{ 
                          height: '250px', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title className="textile-primary">{product.name}</Card.Title>
                      <Card.Text className="text-muted">
                        {product.description || 'High-quality textile product manufactured with precision and care.'}
                      </Card.Text>
                      
                      <div className="mb-3">
                        <h6 className="textile-primary">Quality Parameters:</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {product.qualityNames && product.qualityNames.map((quality, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1">
                              <FaCheckCircle className="me-1" />
                              {quality}
                            </Badge>
                          ))}
                          {!product.qualityNames && (
                            <Badge bg="info" text="white">
                              {product.qualities || 4} Quality Parameters
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="product-status">
                        <span className="badge bg-success">
                          Available
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col className="text-center">
                <div className="py-5">
                  <FaIndustry size={80} className="text-muted mb-3" />
                  <h4 className="text-muted">No Products Available</h4>
                  <p className="text-muted">
                    {products.length === 0 
                      ? "Products will be displayed here once they are added to the system."
                      : "All products are currently unavailable. Please check back later."
                    }
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Quality Assurance */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Quality Assurance</h2>
              <p className="text-muted">Our commitment to excellence in every thread</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <FaIndustry />
              </div>
              <h5>Modern Manufacturing</h5>
              <p className="text-muted">
                State-of-the-art facilities with advanced technology for consistent quality 
                across all our products.
              </p>
            </Col>
            
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <FaCheckCircle />
              </div>
              <h5>Rigorous Testing</h5>
              <p className="text-muted">
                Every batch undergoes comprehensive testing to ensure it meets our exacting 
                quality standards.
              </p>
            </Col>
            
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <FaIndustry />
              </div>
              <h5>ISO Certified</h5>
              <p className="text-muted">
                Our processes are ISO 9001:2015 certified, ensuring international quality 
                standards compliance.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Categories */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="textile-primary">Product Categories</h2>
              <p className="text-muted">Comprehensive range for all your textile needs</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={3} className="text-center mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h5 className="textile-primary">Natural Fibers</h5>
                  <p className="text-muted">
                    Cotton, silk, wool, and other natural materials for premium quality fabrics.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h5 className="textile-primary">Synthetic Fibers</h5>
                  <p className="text-muted">
                    Modern synthetic materials for specialized applications and performance.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h5 className="textile-primary">Blended Fabrics</h5>
                  <p className="text-muted">
                    Innovative combinations of natural and synthetic fibers for optimal performance.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="text-center mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h5 className="textile-primary">Specialty Textiles</h5>
                  <p className="text-muted">
                    Custom fabrics for specific industrial and commercial applications.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h3>Interested in Our Products?</h3>
              <p className="lead">
                Contact us to learn more about our textile solutions and get a quote for your needs.
              </p>
              <a href="/contact" className="btn btn-light btn-lg">
                Get in Touch
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Products; 