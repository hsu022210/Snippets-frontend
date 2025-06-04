import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Welcome to Code Snippets</h1>
          <p className="lead mb-4">
            A simple and elegant way to store and share your code snippets.
          </p>
          {user ? (
            <div>
              <p>Welcome back, {user.username}!</p>
              <Button as={Link} to="/snippets" variant="primary" size="lg" className="me-3">
                View My Snippets
              </Button>
              <Button as={Link} to="/create-snippet" variant="success" size="lg">
                Create Snippet
              </Button>
            </div>
          ) : (
            <div>
              <p>Please log in to manage your snippets.</p>
              <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg">
                Register
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Store</Card.Title>
              <Card.Text>
                Save your code snippets in a secure and organized way.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Syntax Highlighting</Card.Title>
              <Card.Text>
                Beautiful syntax highlighting for multiple programming languages.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Share</Card.Title>
              <Card.Text>
                Share your snippets with others or keep them private.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 