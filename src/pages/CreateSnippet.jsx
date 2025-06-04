import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { sql } from '@codemirror/lang-sql';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateSnippet = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLanguageExtension = (selectedLanguage) => {
    if (!selectedLanguage) return [];
    
    try {
      const languageMap = {
        'javascript': javascript({ jsx: true }),
        'python': python(),
        'html': html(),
        'css': css(),
        'java': java(),
        'cpp': cpp(),
        'c': cpp(),
        'sql': sql(),
        'json': json(),
        'markdown': markdown(),
        'typescript': javascript({ typescript: true }),
      };
      
      return languageMap[selectedLanguage.toLowerCase()] || [];
    } catch (error) {
      console.error('Error loading language extension:', error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/snippets/', {
        title,
        code,
        language,
      });
      navigate(`/snippets/${response.data.id}`);
    } catch (error) {
      setError('Failed to create snippet');
      console.error('Error creating snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Container className="py-4">
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
            <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
              <CodeMirror
                value={code}
                height="300px"
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
                placeholder="Enter your code here..."
              />
            </div>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateSnippet; 