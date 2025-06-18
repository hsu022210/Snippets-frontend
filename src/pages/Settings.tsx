import { ChangeEvent, useState } from 'react'
import { useCodeMirrorTheme } from '../contexts/CodeMirrorThemeContext'
import { usePreviewHeight } from '../contexts/PreviewHeightContext'
import { useTheme } from '../contexts/ThemeContext'
import { Container, Card, Form, Row, Col, Nav, Tab } from 'react-bootstrap'
import CodeEditor from '../components/shared/CodeEditor'
import { getPageSize, setPageSize } from '../utils/pagination'
import { TbSun, TbMoon } from 'react-icons/tb'
import { EditorSettingsProps, DisplaySettingsProps, GeneralSettingsProps } from '../types/ui'

const SettingsNav: React.FC = () => (
  <Nav variant="pills" className="flex-column border-0 h-100 p-3 settings-nav">
    <Nav.Item className="mb-2">
      <Nav.Link 
        eventKey="editor" 
        className="rounded-pill"
      >
        <span className="fw-normal">Editor Settings</span>
      </Nav.Link>
    </Nav.Item>
    <Nav.Item className="mb-2">
      <Nav.Link 
        eventKey="display" 
        className="rounded-pill"
      >
        <span className="fw-normal">Display Settings</span>
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link 
        eventKey="general" 
        className="rounded-pill"
      >
        <span className="fw-normal">General Settings</span>
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
  onThemeToggle
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
  </>
);

const Settings: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useCodeMirrorTheme();
  const { previewHeight, setPreviewHeight } = usePreviewHeight();
  const { isDark, toggleTheme } = useTheme();
  const [pageSize, setLocalPageSize] = useState<number>(getPageSize);

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

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Settings</h2>
      </div>

      <Card className={`shadow-sm ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
        <Card.Body className="p-0">
          <Tab.Container defaultActiveKey="editor">
            <Row className="g-0">
              <Col lg={3} className="border-end">
                <SettingsNav />
              </Col>
              
              <Col lg={9}>
                <Tab.Content className="p-4">
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

                  <Tab.Pane eventKey="general">
                    <GeneralSettings
                      isDark={isDark}
                      onThemeToggle={toggleTheme}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings; 