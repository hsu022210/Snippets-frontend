import { Container, Row, Col, Card, Figure } from 'react-bootstrap';

const Disclaimer: React.FC = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="border-0">
            <Card.Body>
              <div className="text-center mb-5">
                <Figure>
                  <Figure.Image
                    src="/code-icon-lg.svg"
                    alt="Logo"
                    width={96}
                    height={20}
                    className="mb-5"
                  />
                </Figure>
              </div>
              <h1 className="h2 fw-bold mb-3">DISCLAIMER</h1>
              <div className="text-secondary mb-4">
                <strong>Last updated </strong>
                <strong>June 05, 2025</strong>
              </div>
              <h2 className="h4 fw-bold mb-3">WEBSITE DISCLAIMER</h2>
              <p className="text-secondary mb-3">
                The information provided by Alec Hsu ("we," "us," or "our") on{' '}
                <a
                  href="https://snippets-frontend-ogbf.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none"
                >
                  https://snippets-frontend-ogbf.onrender.com
                </a>{' '}
                (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.
              </p>
              <p className="text-secondary">
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