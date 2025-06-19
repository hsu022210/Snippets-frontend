import { Modal, Card, Stack, Button, Pagination, Row, Col, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { Colorful } from '@uiw/react-color';
import { PRIMARY_COLORS } from '../utils/primaryColor';
import { PrimaryColorModalProps } from '../types/ui';

const PrimaryColorModal: React.FC<PrimaryColorModalProps> = ({
  show,
  onHide,
  primaryColor,
  onPrimaryColorChange,
  isDark,
}) => (
  <Modal show={show} onHide={onHide} centered size="xl">
    <Modal.Header closeButton>
      <Modal.Title>Choose Primary Color</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* Preview Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h6">Preview</Card.Title>
          <Stack direction="horizontal" gap={4} className="align-items-start">
            {/* Button Previews */}
            <Stack gap={2}>
              <small className="text-muted">Buttons:</small>
              <Stack direction="horizontal" gap={2}>
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="outline-primary" size="sm">Outline</Button>
              </Stack>
            </Stack>
            {/* Pagination Preview */}
            <Stack gap={2}>
              <small className="text-muted">Pagination:</small>
              <Pagination size="sm">
                <Pagination.Prev />
                <Pagination.Item>1</Pagination.Item>
                <Pagination.Item active>2</Pagination.Item>
                <Pagination.Item>3</Pagination.Item>
                <Pagination.Next />
              </Pagination>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>

      {/* Color Options and Custom Picker Row */}
      <Row className="g-4 flex-column flex-md-row">
        {/* Color Options Section */}
        <Col xs={12} md={7} lg={8} className="mb-4 mb-md-0">
          <h6 className={isDark ? 'text-light' : 'text-dark'}>Choose a preset color:</h6>
          <Row className="g-3">
            {PRIMARY_COLORS.map((color) => (
              <Col key={color.value} xs={6} sm={4} md={6} lg={4}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-${color.value}`}>{color.value}</Tooltip>}
                >
                  <Card
                    className={`cursor-pointer ${primaryColor === color.value ? (isDark ? 'bg-dark' : 'bg-light') : ''}`}
                    onClick={() => onPrimaryColorChange({ target: { value: color.value } } as React.ChangeEvent<HTMLInputElement>)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="p-2">
                      <Stack direction="horizontal" gap={2} className="align-items-center">
                        <Form.Check
                          type="radio"
                          id={`color-${color.value}`}
                          name="primaryColor"
                          value={color.value}
                          checked={primaryColor === color.value}
                          onChange={onPrimaryColorChange}
                          className="mb-0"
                          aria-label={color.label}
                        />
                        <div
                          className="border rounded"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: color.value,
                            flexShrink: 0
                          }}
                        />
                        <small>{color.label}</small>
                      </Stack>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Custom Color Picker Section */}
        <Col xs={12} md={5} lg={4} className="d-flex flex-column align-items-center justify-content-start">
          <h6 className={isDark ? 'text-light' : 'text-dark'}>Or pick a custom color:</h6>
          <Stack direction="horizontal" gap={3} className="align-items-center justify-content-center w-100">
            <Colorful
              color={primaryColor}
              onChange={color => {
                onPrimaryColorChange({ target: { value: color.hex } } as React.ChangeEvent<HTMLInputElement>);
              }}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 8, maxWidth: 220, width: '100%' }}
              disableAlpha
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: '1px solid #ccc',
                backgroundColor: primaryColor,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
              title={`Selected color: ${primaryColor}`}
            />
          </Stack>
          <div className="mt-2">
            <span className="badge bg-secondary">{primaryColor}</span>
          </div>
        </Col>
      </Row>
    </Modal.Body>
  </Modal>
);

export default PrimaryColorModal; 