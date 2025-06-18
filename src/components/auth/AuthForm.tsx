import { Card, Row, Col } from 'react-bootstrap'
import { AuthFormProps } from '../../types'

const AuthForm = ({ title, className = '', children }: AuthFormProps) => {
  const getContainerClasses = (): string => {
    const classes = ['center-content'];
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={getContainerClasses()}>
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={10} md={8} lg={6} xl={4}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">{title}</h2>
              {children}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuthForm; 