import { ChangeEvent, useState } from 'react'
import { useCodeMirrorTheme } from '../hooks/useCodeMirrorTheme'
import { usePreviewHeight } from '../hooks/usePreviewHeight'
import { useTheme } from '../contexts/ThemeContext'
import { Container, Card, Form, Row, Col, Nav, Tab, Modal, Pagination, Stack } from 'react-bootstrap'
import CodeEditor from '../components/shared/CodeEditor'
import { getPageSize, setPageSize } from '../utils/pagination'
import { getPrimaryColorLabel, PRIMARY_COLORS } from '../utils/primaryColor'
import { TbSun, TbMoon, TbPalette } from 'react-icons/tb'
import { EditorSettingsProps, DisplaySettingsProps, GeneralSettingsProps } from '../types/ui'
import Button from '../components/shared/Button'

const SettingsNav: React.FC = () => (
  <Nav variant="pills" className="flex-column d-flex settings-nav">
    <Nav.Item className="mb-3 w-100">
      <Nav.Link 
        eventKey="general" 
      >
        <span>General Settings</span>
      </Nav.Link>
    </Nav.Item>
    <Nav.Item className="mb-3 w-100">
      <Nav.Link 
        eventKey="editor" 
      >
        <span>Editor Settings</span>
      </Nav.Link>
    </Nav.Item>
    <Nav.Item className="w-100">
      <Nav.Link 
        eventKey="display" 
      >
        <span>Display Settings</span>
      </Nav.Link>
    </Nav.Item>
  </Nav>
);

const EditorSettings: React.FC<EditorSettingsProps> = ({
  selectedTheme,
  themeOptions,
  previewHeight,
  isDark,
  onThemeChange,
  onPreviewHeightChange
}) => {
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
    <>
      <h4 className={`mb-4 ${isDark ? 'text-light' : 'text-dark'}`}>Editor Settings</h4>
      
      <div className="mb-4">
        <Form.Group>
          <Form.Label className="fw-bold">Code Editor Theme</Form.Label>
          <Form.Select
            value={selectedTheme}
            onChange={onThemeChange}
            className="mb-2"
            data-testid="theme-select"
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
            <span className={isDark ? 'text-light' : 'text-dark'}>{previewHeight}px</span>
          </Form.Label>
          <Form.Range
            min={75}
            max={350}
            value={previewHeight}
            onChange={onPreviewHeightChange}
            className="mb-2"
          />
          <Form.Text className="text-muted">
            Adjust the height of code previews in snippet cards
          </Form.Text>
        </Form.Group>
      </div>

      <div className="mt-4">
        <h5 className={`mb-3 ${isDark ? 'text-light' : 'text-dark'}`}>Theme Preview</h5>
        <div className="border rounded">
          <CodeEditor
            value={sampleCode}
            language="javascript"
            height={`${previewHeight}px`}
            editable={false}
            theme={selectedTheme}
          />
        </div>
      </div>
    </>
  );
};

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  pageSize,
  onPageSizeChange,
  isDark
}) => (
  <>
    <h4 className={`mb-4 ${isDark ? 'text-light' : 'text-dark'}`}>Display Settings</h4>
    
    <div className="mb-4">
      <Form.Group>
        <Form.Label className="fw-bold">Snippets Per Page</Form.Label>
        <Form.Select
          value={pageSize}
          onChange={onPageSizeChange}
          className="mb-2"
        >
          <option value="6">6 snippets</option>
          <option value="12">12 snippets</option>
          <option value="24">24 snippets</option>
          <option value="48">48 snippets</option>
        </Form.Select>
        <Form.Text className="text-muted">
          Choose how many snippets to display per page in the snippet list
        </Form.Text>
      </Form.Group>
    </div>
  </>
);

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  isDark,
  onThemeToggle,
  primaryColor,
  onPrimaryColorChange,
  showColorModal,
  onShowColorModal,
  onHideColorModal
}) => (
  <>
    <h4 className={`mb-4 ${isDark ? 'text-light' : 'text-dark'}`}>General Settings</h4>
    
    <div className="mb-4">
      <Form.Group>
        <Form.Label className="fw-bold d-flex align-items-center gap-2">
          <span>Application Theme</span>
          <div className="d-flex align-items-center gap-2 ms-2">
            <TbSun size={18} className={isDark ? 'text-muted' : 'text-warning'} />
            <Form.Check
              type="switch"
              id="theme-switch"
              checked={isDark}
              onChange={onThemeToggle}
              className="mb-0"
            />
            <TbMoon size={18} className={isDark ? 'text-info' : 'text-muted'} />
          </div>
        </Form.Label>
        <Form.Text className="text-muted">
          Switch between light and dark mode
        </Form.Text>
      </Form.Group>
    </div>

    <div className="mb-4">
      <Form.Group>
        <Form.Label className="fw-bold">Primary Color</Form.Label>
        <div className="d-flex align-items-center gap-3">
          <Button 
            variant="outline-primary" 
            onClick={onShowColorModal}
            className="d-flex align-items-center gap-2"
          >
            <TbPalette size={16} />
            {getPrimaryColorLabel(primaryColor)}
          </Button>
          <Card
            onClick={onShowColorModal}
            className="border rounded p-0 d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: primaryColor,
              cursor: 'pointer',
              flexShrink: 0
            }}
            title={`Selected color: ${primaryColor}`}
            role="button"
            tabIndex={0}
          />
        </div>
        <Form.Text className="text-muted">
          Choose the primary color for components throughout the site
        </Form.Text>
      </Form.Group>
    </div>

    {/* Color Selection Modal */}
    <Modal show={showColorModal} onHide={onHideColorModal} centered size="lg">
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

        {/* Color Options */}
        <Row className="g-3">
          {PRIMARY_COLORS.map((color) => (
            <Col key={color.value} xs={6} md={4}>
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
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  </>
);

const Settings: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useCodeMirrorTheme();
  const { previewHeight, setPreviewHeight } = usePreviewHeight();
  const { isDark, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const [pageSize, setLocalPageSize] = useState<number>(getPageSize);
  const [showColorModal, setShowColorModal] = useState<boolean>(false);

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  const handlePreviewHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreviewHeight(parseInt(e.target.value, 10));
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setLocalPageSize(newSize);
    setPageSize(newSize);
  };

  const handlePrimaryColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleShowColorModal = () => {
    setShowColorModal(true);
  };

  const handleHideColorModal = () => {
    setShowColorModal(false);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Settings</h2>
      </div>

      <Tab.Container defaultActiveKey="general">
        <Row className="g-4">
          <Col lg={3}>
            <Card className={`shadow-sm ${isDark ? 'bg-dark' : 'bg-light'}`}>
              <Card.Body>
                <SettingsNav />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9}>
            <Card className={`shadow-sm ${isDark ? 'bg-dark' : 'bg-light'}`}>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    <GeneralSettings
                      isDark={isDark}
                      onThemeToggle={toggleTheme}
                      primaryColor={primaryColor}
                      onPrimaryColorChange={handlePrimaryColorChange}
                      showColorModal={showColorModal}
                      onShowColorModal={handleShowColorModal}
                      onHideColorModal={handleHideColorModal}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="editor">
                    <EditorSettings
                      selectedTheme={selectedTheme}
                      themeOptions={themeOptions}
                      previewHeight={previewHeight}
                      isDark={isDark}
                      onThemeChange={handleThemeChange}
                      onPreviewHeightChange={handlePreviewHeightChange}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey="display">
                    <DisplaySettings
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
                      isDark={isDark}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Settings; 