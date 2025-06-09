import React from 'react';
import { useCodeMirrorTheme } from '../contexts/CodeMirrorThemeContext';
import { Container, Card, Form } from 'react-bootstrap';

const Settings = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useCodeMirrorTheme();

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
  };

  return (
    <Container className="py-4">
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings; 