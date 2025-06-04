import { useState, useEffect, useMemo } from 'react';
import { Container, Button, Alert, Modal, Spinner, Breadcrumb, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

const SnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLanguage, setEditedLanguage] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Language options for the dropdown
  const languageOptions = [
    'javascript',
    'python',
    'java',
    'cpp',
    'c',
    'html',
    'css',
    'sql',
    'json',
    'markdown',
    'typescript'
  ];

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await api.get(`/snippets/${id}/`);
        setSnippet(response.data);
        setEditedCode(response.data.code);
        setEditedTitle(response.data.title);
        setEditedLanguage(response.data.language);
        setError('');
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          setError(error.response?.data?.detail || 'Failed to fetch snippet');
        }
        console.error('Error fetching snippet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [api, id, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/snippets/${id}/`);
      navigate('/snippets');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.detail || 'Failed to delete snippet');
      }
      console.error('Error deleting snippet:', error);
    }
    setShowDeleteModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    
    try {
      const response = await api.patch(`/snippets/${id}/`, {
        code: editedCode,
        title: editedTitle,
        language: editedLanguage
      });
      setSnippet(response.data);
      setIsEditing(false);
      setSaveError('');
    } catch (error) {
      if (error.response?.status === 401) {
        setSaveError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setSaveError(error.response?.data?.detail || 'Failed to save changes');
      }
      console.error('Error saving snippet:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCode(snippet.code);
    setEditedTitle(snippet.title);
    setEditedLanguage(snippet.language);
    setSaveError('');
  };

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

  const processedCode = useMemo(() => {
    const codeToProcess = isEditing ? editedCode : snippet?.code;
    if (!codeToProcess) return '';
    
    try {
      // If code is already a string and doesn't look like JSON, return it directly
      if (typeof codeToProcess === 'string' && 
          !codeToProcess.trim().startsWith('{') && 
          !codeToProcess.trim().startsWith('[')) {
        return codeToProcess;
      }
      
      // Handle if code is stored as a JSON string
      if (typeof codeToProcess === 'string') {
        try {
          const parsed = JSON.parse(codeToProcess);
          return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
        } catch {
          // If JSON parsing fails, return the original string
          return codeToProcess;
        }
      }
      
      // Handle if code is already an object
      if (typeof codeToProcess === 'object') {
        return JSON.stringify(codeToProcess, null, 2);
      }

      return String(codeToProcess);
    } catch (error) {
      console.error('Error processing code:', error);
      setCodeError(true);
      return '// Error: Could not process code content';
    }
  }, [isEditing, editedCode, snippet?.code]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-content">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="center-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="page-container">
        <div className="center-content">
          <Alert variant="warning">Snippet not found</Alert>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="page-container">
        <Container className="py-4">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/snippets" }}>
              Snippets
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {isEditing ? editedTitle : (snippet?.title || 'Untitled Snippet')}
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="d-flex justify-content-between align-items-center mb-4">
            {isEditing ? (
              <Form.Group className="mb-3 flex-grow-1 me-3">
                <Form.Control
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Enter snippet title"
                />
              </Form.Group>
            ) : (
              <h2>{snippet.title || 'Untitled Snippet'}</h2>
            )}
            <div className="d-flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
              <Form.Group>
                <Form.Label><strong>Language:</strong></Form.Label>
                <Form.Select
                  value={editedLanguage}
                  onChange={(e) => setEditedLanguage(e.target.value)}
                  className="w-auto"
                >
                  <option value="">None</option>
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <><strong>Language:</strong> {snippet.language || 'None'}</>
            )}
          </div>

          {saveError && (
            <Alert variant="danger" className="mb-3">
              {saveError}
            </Alert>
          )}

          {codeError && (
            <Alert variant="warning" className="mb-3">
              There was an issue processing the code content. The display might be affected.
            </Alert>
          )}

          <div className="mb-4" style={{ border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
            <CodeMirror
              value={processedCode}
              height="400px"
              theme="dark"
              onChange={(value) => isEditing && setEditedCode(value)}
              extensions={[getLanguageExtension(snippet.language)]}
              editable={isEditing}
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
          </div>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this snippet? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </ErrorBoundary>
  );
};

export default SnippetDetail; 