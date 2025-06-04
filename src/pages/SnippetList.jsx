import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Stack, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
import './SnippetList.css';

const SnippetList = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { api } = useAuth();

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

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await api.get('/snippets/');
        setSnippets(response.data.results);
        setError('');
      } catch (error) {
        setError('Failed to fetch snippets');
        console.error('Error fetching snippets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [api]);

  if (loading) {
    return (
      <div className="snippet-list-container d-flex align-items-center justify-content-center">
        <Stack direction="vertical" gap={2} className="align-items-center">
          <Spinner animation="border" role="status" />
          <span>Loading snippets...</span>
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div className="snippet-list-container d-flex align-items-center justify-content-center">
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="snippet-list-container">
      <Container fluid="lg" className="px-3 px-lg-4">
        <Stack gap={3}>
          <div className="d-flex d-md-none flex-column align-items-stretch mb-3">
            <Button
              as={Link}
              to="/create-snippet"
              variant="primary"
              size="lg"
              className="mb-4"
            >
              Create Snippet
            </Button>
            <h2 className="h3 mb-0 text-center">My Snippets</h2>
          </div>

          <div className="d-none d-md-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">My Snippets</h2>
            <Button
              as={Link}
              to="/create-snippet"
              variant="primary"
            >
              Create Snippet
            </Button>
          </div>

          {snippets.length > 0 ? (
            <Row className="g-4">
              {snippets.map((snippet) => (
                <Col key={snippet.id} xs={12} md={6} lg={4}>
                  <Card className="h-100 snippet-card">
                    <Card.Body className="d-flex flex-column">
                      <Stack gap={2}>
                        <div>
                          <Card.Title className="text-truncate mb-1">
                            {snippet.title || 'Untitled Snippet'}
                          </Card.Title>
                          <Card.Subtitle className="text-muted">
                            Language: {snippet.language || 'None'}
                          </Card.Subtitle>
                        </div>
                        
                        <div className="snippet-preview flex-grow-1">
                          <CodeMirror
                            value={snippet.code}
                            maxHeight="75px"
                            theme="dark"
                            editable={false}
                            basicSetup={{
                              lineNumbers: false,
                              foldGutter: false,
                              dropCursor: false,
                              allowMultipleSelections: false,
                              indentOnInput: false,
                              bracketMatching: false,
                              closeBrackets: false,
                              autocompletion: false,
                              rectangularSelection: false,
                              crosshairCursor: false,
                              highlightActiveLine: false,
                              highlightSelectionMatches: false,
                              closeBracketsKeymap: false,
                              defaultKeymap: false,
                              searchKeymap: false,
                              historyKeymap: false,
                              foldKeymap: false,
                              completionKeymap: false,
                              lintKeymap: false,
                            }}
                            extensions={[getLanguageExtension(snippet.language)]}
                          />
                        </div>

                        <Button
                          as={Link}
                          to={`/snippets/${snippet.id}`}
                          variant="outline-primary"
                          className="mt-auto w-100"
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center p-4">
              <Card.Body>
                <Stack gap={3} className="align-items-center">
                  <p className="mb-0">No snippets found. Create your first snippet!</p>
                  <Button
                    as={Link}
                    to="/create-snippet"
                    variant="primary"
                    className="create-snippet-btn"
                  >
                    Create Snippet
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          )}
        </Stack>
      </Container>
    </div>
  );
};

export default SnippetList; 