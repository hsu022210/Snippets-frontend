import { Card, Row, Col } from 'react-bootstrap';
import Container from '../shared/Container';

const AuthForm = ({ title, children }) => {
  return (
    <Container>
      <div className="center-content">
        <Row className="justify-content-center w-100">
          <Col xs={11} sm={10} md={8} lg={6} xl={4}>
            <Card>
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">{title}</h2>
                {children}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AuthForm; 