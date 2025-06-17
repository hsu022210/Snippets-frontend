import React from 'react';
import { Container, Row, Col, Card, Figure } from 'react-bootstrap';

const Disclaimer: React.FC = () => {
  return (
    <Container className="py-4" data-testid="disclaimer-container">
      <Row className="justify-content-center">
        <Col lg={8} md={10} xs={12}>
          <Card className="border-0">
            <Card.Body>
              <Figure className="figure">
                <Figure.Image
                  src="/code-icon-lg.svg"
                  alt="Logo"
                  width={96}
                  height={20}
                />
              </Figure>
              <h2 className="h2 fw-bold mb-3">DISCLAIMER</h2>
              <p className="text-muted mb-4">
                Last updated <span className="fw-bold">June 05, 2025</span>
              </p>
              <h4 className="h4 fw-bold mb-3">WEBSITE DISCLAIMER</h4>
              <p className="text-secondary mb-3">
                The information provided by Alec Hsu ("we," "us," or "our") on{' '}
                <a
                  href="https://snippets-frontend-ogbf.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://snippets-frontend-ogbf.onrender.com
                </a>{' '}
                (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.
              </p>
              <p className="text-secondary mb-3">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Disclaimer; 