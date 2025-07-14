import { Row, Col, Stack } from 'react-bootstrap';
import Container from '../components/shared/Container';
import Card, { Body, Title, Text } from '../components/shared/Card';
import Button from '../components/shared/Button';
import { TbSparkles, TbHeart, TbStar, TbBolt } from 'react-icons/tb';

const AnimationDemo: React.FC = () => {
  return (
    <Container className="my-5 animate-fade-in-up">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4 animate-fade-in-up">
            <TbSparkles className="me-3 animate-pulse" />
            Animation Showcase
          </h1>
          <p className="lead animate-fade-in-scale">
            Explore the popular animations we've added to enhance your experience!
          </p>
        </Col>
      </Row>

      <Row className="animate-stagger">
        <Col md={6} lg={3} className="mb-4">
          <Card className="hover-lift h-100" hover>
            <Body className="text-center">
              <TbHeart className="mb-3 animate-pulse" size={48} color="#e74c3c" />
              <Title>Hover Effects</Title>
              <Text>
                Cards lift and glow on hover with smooth transitions.
              </Text>
            </Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="hover-scale h-100" hover>
            <Body className="text-center">
              <TbStar className="mb-3 animate-pulse" size={48} color="#f39c12" />
              <Title>Scale Animations</Title>
              <Text>
                Elements scale smoothly on interaction.
              </Text>
            </Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="hover-glow h-100" hover>
            <Body className="text-center">
              <TbBolt className="mb-3 animate-pulse" size={48} color="#3498db" />
              <Title>Glow Effects</Title>
              <Text>
                Beautiful glow effects on hover and focus.
              </Text>
            </Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="hover-lift h-100" hover>
            <Body className="text-center">
              <TbSparkles className="mb-3 animate-pulse" size={48} color="#9b59b6" />
              <Title>Stagger Animations</Title>
              <Text>
                Elements animate in sequence for visual flow.
              </Text>
            </Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8} className="mx-auto">
          <Card className="animate-fade-in-scale">
            <Body className="text-center">
              <Title>Interactive Buttons</Title>
              <Text className="mb-4">
                Try hovering and clicking these buttons to see the animations!
              </Text>
              <Stack direction="horizontal" gap={3} className="justify-content-center flex-wrap">
                <Button variant="primary" size="lg">
                  Primary Button
                </Button>
                <Button variant="outline-secondary" size="lg">
                  Secondary Button
                </Button>
                <Button variant="success" size="lg">
                  Success Button
                </Button>
              </Stack>
            </Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <Card className="animate-slide-in-left">
            <Body>
              <Title>Slide In Left</Title>
              <Text>
                This card slides in from the left with a smooth animation.
              </Text>
            </Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="animate-slide-in-right">
            <Body>
              <Title>Slide In Right</Title>
              <Text>
                This card slides in from the right with a smooth animation.
              </Text>
            </Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12}>
          <Card className="animate-bounce">
            <Body className="text-center">
              <Title>Bounce Animation</Title>
              <Text>
                This card has a playful bounce animation when it appears!
              </Text>
            </Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnimationDemo; 