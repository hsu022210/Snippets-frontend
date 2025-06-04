import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Stack, Spinner, Alert } from 'react-bootstrap';
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
      <Container fluid className="snippet-list-container d-flex align-items-center justify-content-center">
        <Stack gap={2} className="text-center">
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" variant="primary" />
          </div>
          <span>Loading snippets...</span>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="snippet-list-container d-flex align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="snippet-list-container">
      <Container>
        {/* Mobile Header */}
        <div className="d-md-none mb-4">
          <Stack gap={4} className="py-4 my-4">
            <Button
              as={Link}
              to="/create-snippet"
              variant="primary"
              size="lg"
              className="w-100 py-3"
            >
              Create Snippet
            </Button>
            <h2 className="h3 text-center mb-0">My Snippets</h2>
          </Stack>
        </div>

        {/* Desktop Header */}
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
          <Row xs={1} md={2} lg={3} className="g-4">
            {snippets.map((snippet) => (
              <Col key={snippet.id}>
                <Card className="h-100 snippet-card">
                  <Card.Body className="d-flex flex-column">
                    <Stack gap={3}>
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
          <Card className="text-center">
            <Card.Body>
              <Stack gap={3} className="align-items-center">
                <Card.Text>No snippets found. Create your first snippet!</Card.Text>
                <Button
                  as={Link}
                  to="/create-snippet"
                  variant="primary"
                >
                  Create Snippet
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        )}
      </Container>
    </Container>
  );
};

export default SnippetList; 