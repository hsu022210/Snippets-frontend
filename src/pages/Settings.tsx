import React, { ChangeEvent } from 'react'
import { useCodeMirrorTheme } from '../contexts/CodeMirrorThemeContext'
import { usePreviewHeight } from '../contexts/PreviewHeightContext'
import { Container, Card, Form, Row, Col } from 'react-bootstrap'
import CodeEditor from '../components/shared/CodeEditor'

const Settings: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useCodeMirrorTheme();
  const { previewHeight, setPreviewHeight } = usePreviewHeight();

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  const handlePreviewHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreviewHeight(parseInt(e.target.value, 10));
  };

  const sampleCode = `// Sample code to preview the theme
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => {
    if (typeof num === 'number') {
      return sum + num;
    }
    return sum;
  }, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log('Sum:', result);`;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Settings</h2>
      </div>

      <Row>
        {/* <Col lg={3}>
          <Card className="mb-4">
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link href="#editor" className="active">
                  <i className="bi bi-code-square me-2"></i>
                  Editor Settings
                </Nav.Link>
                <Nav.Link href="#appearance">
                  <i className="bi bi-palette me-2"></i>
                  Appearance
                </Nav.Link>
                <Nav.Link href="#notifications">
                  <i className="bi bi-bell me-2"></i>
                  Notifications
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col> */}

        <Col lg={9}>
          <Card>
            <Card.Body>
              <div id="editor">
                <h4 className="mb-4">Editor Settings</h4>
                
                <div className="mb-4">
                  <Form.Group>
                    <Form.Label className="fw-bold">Code Editor Theme</Form.Label>
                    <Form.Select
                      value={selectedTheme}
                      onChange={handleThemeChange}
                      className="mb-2"
                    >
                      {themeOptions.map((theme) => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Choose your preferred theme for the code editor
                    </Form.Text>
                  </Form.Group>
                </div>

                <div className="mb-4">
                  <Form.Group>
                    <Form.Label className="fw-bold d-flex justify-content-between">
                      <span>Snippet Preview Height</span>
                      <span className="text-primary">{previewHeight}px</span>
                    </Form.Label>
                    <Form.Range
                      min={75}
                      max={350}
                      value={previewHeight}
                      onChange={handlePreviewHeightChange}
                      className="mb-2"
                    />
                    <Form.Text className="text-muted">
                      Adjust the height of code previews in snippet cards
                    </Form.Text>
                  </Form.Group>
                </div>

                <div className="mt-4">
                  <h5 className="mb-3">Theme Preview</h5>
                  <div className="border rounded">
                    <CodeEditor
                      value={sampleCode}
                      language="javascript"
                      height={`${previewHeight}px`}
                      editable={false}
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings; 