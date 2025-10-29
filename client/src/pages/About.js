import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <div className="about-page" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <Container>
      <h3>Shunmugam Textiles - Komarapalayam</h3>

        {/* FOUNDER Section */}
        <div className="founder-section mt-4" style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            textDecoration: 'underline', 
            marginBottom: '30px', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            FOUNDER
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <img 
              src="/nachiappan.jpg" 
              alt="P. Nachiappan" 
              style={{ 
                width: '150px', 
                height: '200px', 
                objectFit: 'cover',
                border: '2px solid #ccc'
              }} 
            />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
            (late) P. Nachiappan
          </p>
        </div>

        {/* BOARD OF DIRECTORS Section */}
        <div className="board-section">
          <h2 style={{ 
            textDecoration: 'underline', 
            marginBottom: '40px', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            BOARD OF DIRECTORS
          </h2>
          
          {/* Top Row - Proprietors */}
          <Row className="justify-content-center" style={{ marginBottom: '40px' }}>
            <Col md={4} className="text-center">
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src="/sellamuthu.jpg" 
                  alt="N. Sellamuthu" 
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    objectFit: 'cover',
                    border: '2px solid #ccc'
                  }} 
                />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                N. Sellamuthu
              </p>
              <p style={{ fontSize: '14px' }}>
                (proprietor)
              </p>
            </Col>
            
            <Col md={4} className="text-center">
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src="/loganathan.jpg" 
                  alt="N. Loganathan" 
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    objectFit: 'cover',
                    border: '2px solid #ccc'
                  }} 
                />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                N. Loganathan
              </p>
              <p style={{ fontSize: '14px' }}>
                (proprietor)
              </p>
            </Col>
          </Row>

          {/* Bottom Row - Executive Directors */}
          <Row className="justify-content-center">
            <Col md={4} className="text-center" style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src="/mythies.jpg" 
                  alt="S. Mythies Kumar" 
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    objectFit: 'cover',
                    border: '2px solid #ccc'
                  }} 
                />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                S. Mythirei Kumar
              </p>
              <p style={{ fontSize: '14px' }}>
                Executive Director
              </p>
            </Col>
            
            <Col md={4} className="text-center" style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src="/shanmugaraj.jpg" 
                  alt="L. Shanmugaraj" 
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    objectFit: 'cover',
                    border: '2px solid #ccc'
                  }} 
                />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                L. Shanmugaraj
              </p>
              <p style={{ fontSize: '14px' }}>
                Executive Director
              </p>
            </Col>
            
            <Col md={4} className="text-center" style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src="/arun.jpg" 
                  alt="S. Arun" 
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    objectFit: 'cover',
                    border: '2px solid #ccc'
                  }} 
                />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                S. Arun
              </p>
              <p style={{ fontSize: '14px' }}>
                Executive Director
              </p>
            </Col>
          </Row>
        </div>
      </Container>
      <Container>
      <p>Shunmugam Textiles, was registered and incorporated in 1975 with current GST NO: 33ABTPL6234F1ZK. Based in TamilNadu, India, we have garnered acclaim as the Manufacturer and Supplier of Cotton Lungies and Towels. Initially we started our company to trade Lungies for the needs of Tamilnadu Customers. Later we started our own production with capacity of 300 power looms and expanded our production across Tamilnadu. Gradually our products were marketed to Andhra Pradesh, Telangana, Kerala, Bihar, Assam, Uttar Pradesh, Karnataka, West Bengal, Orissa and Maharashtra. The Company Manufactures powerloom Lungies and Towels in the Name of Leader Brand, Sun-Star and Jai Bharath Brand. We are the only Major Manufacturer of Powerloom Lungies and Towels in Indian Market with 300 plus owned drop-box powerlooms. Our Lungies and towels are made with high quality Combed Yarn. The finished goods supplied by the Weavers are checked for stringent Quality, branded and released for Sale. The Quality is controlled internally by our trained and qualified staff. We are having more than 40 years experience in the Manufacture and Sales of Powerloom Lungies and Towels. Available in various colors and patterns, the offered Lungies and Towels were highly appreciated for their color-fastness, soft and easy to wash property. In addition, we have our sister concern companies S.A.M Lungie Company GSTN NO: 33AFMPC1211Q1ZM & Nachiappan Traders with a vast distribution network to cater the needs of the clients promptly.</p>
      </Container>
    </div>
  );
};

export default About; 