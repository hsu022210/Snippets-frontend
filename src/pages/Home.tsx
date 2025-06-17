import { Row, Col, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Container from '../components/shared/Container'
import Card, { Body, Title, Text } from '../components/shared/Card'
import Button from '../components/shared/Button'
import { TbCode, TbPalette, TbShare } from 'react-icons/tb'

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Simple and elegant way to store and share your code snippets.</h1>
          <p className="lead mb-5">
            Start creating your own snippets!
          </p>
          {user ? (
            <div>
              <Stack 
                direction="horizontal" 
                gap={3} 
                className="justify-content-center flex-wrap"
              >
                <Button 
                  as={Link} 
                  to="/snippets" 
                  variant="primary" 
                  size="lg"
                  className="w-100 w-md-auto"
                >
                  View My Snippets
                </Button>
                <Button 
                  as={Link} 
                  to="/create-snippet" 
                  variant="outline-primary" 
                  size="lg"
                  className="w-100 w-md-auto"
                >
                  Create Snippet
                </Button>
              </Stack>
            </div>
          ) : (
            <div>
              <Stack 
                direction="horizontal" 
                gap={3} 
                className="justify-content-center flex-wrap"
              >
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="primary" 
                  size="lg"
                  className="w-100 w-md-auto"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="outline-primary" 
                  size="lg"
                  className="w-100 w-md-auto"
                >
                  Register
                </Button>
              </Stack>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4" hover>
            <Body>
              <TbCode className="mb-3" size={32} />
              <Title>Store</Title>
              <Text>
                Save your code snippets in a secure and organized way.
              </Text>
            </Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4" hover>
            <Body>
              <TbPalette className="mb-3" size={32} />
              <Title>Syntax Highlighting</Title>
              <Text>
                Beautiful syntax highlighting for multiple programming languages.
              </Text>
            </Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4" hover>
            <Body>
              <TbShare className="mb-3" size={32} />
              <Title>Share</Title>
              <Text>
                Share your snippets with others or keep them private.
              </Text>
            </Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 