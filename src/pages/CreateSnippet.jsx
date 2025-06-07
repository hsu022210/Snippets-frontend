import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { useAuth } from '../contexts/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { getLanguageExtension } from '../utils/languageUtils';
import Container from '../components/shared/Container';

const CreateSnippet = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { api } = useAuth();
  const { makeRequest } = useApiRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await makeRequest(
        () => api.post('/snippets/', {
          title,
          code,
          language,
        })
      );
      navigate(`/snippets/${response.data.id}`);
    } catch (error) {
      setError('Failed to create snippet');
      console.error('Error creating snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container pageContainer>
        <h2 className="mb-4">Create Snippet</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter snippet title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="">Select language</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="typescript">TypeScript</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
              <CodeMirror
                value={code}
                height="330px"
                theme="dark"
                onChange={(value) => setCode(value)}
                extensions={[getLanguageExtension(language)]}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  history: true,
                  foldGutter: true,
                  drawSelection: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: true,
                  crosshairCursor: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  defaultKeymap: true,
                  searchKeymap: true,
                  historyKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
              />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="submit"
              value={loading ? 'Creating...' : 'Create Snippet'}
              disabled={loading}
            />
          </Form.Group>
        </Form>
    </Container>
  );
};

export default CreateSnippet;
