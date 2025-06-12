import React, { ChangeEvent } from 'react';
import { useCodeMirrorTheme } from '../contexts/CodeMirrorThemeContext';
import { Container, Card, Form } from 'react-bootstrap';
import CodeEditor from '../components/shared/CodeEditor';

const Settings: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useCodeMirrorTheme();

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
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
      <h2 className="mb-4">Settings</h2>
      <Card>
        <Card.Body>
          <h5 className="mb-3">Editor Settings</h5>
          <Form.Group className="mb-3">
            <Form.Label>Code Editor Theme</Form.Label>
            <Form.Select
              value={selectedTheme}
              onChange={handleThemeChange}
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

          <div className="mt-4">
            <h5 className="mb-3">Theme Preview</h5>
            <CodeEditor
              value={sampleCode}
              language="javascript"
              height="200px"
              editable={false}
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings; 