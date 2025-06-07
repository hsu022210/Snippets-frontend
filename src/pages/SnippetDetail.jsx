import { useState, useMemo } from 'react';
import { Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import ErrorBoundary from '../components/ErrorBoundary';
import InlineLoadingSpinner from '../components/InlineLoadingSpinner';
import { useSnippet } from '../hooks/useSnippet';
import { getLanguageExtension, processCode } from '../utils/languageUtils';
import SnippetHeader from '../components/snippet/SnippetHeader';
import SnippetLanguageSelector from '../components/snippet/SnippetLanguageSelector';
import DeleteConfirmationModal from '../components/snippet/DeleteConfirmationModal';
import Container from '../components/shared/Container';

const SnippetDetail = () => {
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeError, setCodeError] = useState(false);
  
  const {
    snippet,
    loading,
    error,
    saving,
    saveError,
    isEditing,
    editedCode,
    editedTitle,
    editedLanguage,
    setIsEditing,
    setEditedCode,
    setEditedTitle,
    setEditedLanguage,
    handleSave,
    handleDelete,
    handleCancel
  } = useSnippet(id);

  const processedCode = useMemo(() => {
    const codeToProcess = isEditing ? editedCode : snippet?.code;
    try {
      return processCode(codeToProcess);
    } catch (error) {
      console.error('Error processing code:', error);
      setCodeError(true);
      return '// Error: Could not process code content';
    }
  }, [isEditing, editedCode, snippet?.code]);

  if (loading) {
    return (
      <Container pageContainer>
        <div className="center-content">
          <InlineLoadingSpinner message="Loading snippet..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container pageContainer>
        <div className="center-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </Container>
    );
  }

  if (!snippet) {
    return (
      <Container pageContainer>
        <div className="center-content">
          <Alert variant="warning">Snippet not found</Alert>
        </div>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container pageContainer>
        <Container className="py-4">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/snippets" }}>
              Snippets
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {isEditing ? editedTitle : (snippet?.title || 'Untitled Snippet')}
            </Breadcrumb.Item>
          </Breadcrumb>

          <SnippetHeader
            isEditing={isEditing}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            saving={saving}
            handleCancel={handleCancel}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            setShowDeleteModal={setShowDeleteModal}
            title={snippet.title}
          />

          <SnippetLanguageSelector
            isEditing={isEditing}
            editedLanguage={editedLanguage}
            setEditedLanguage={setEditedLanguage}
            language={snippet.language}
          />

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

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDelete();
              setShowDeleteModal(false);
            }}
          />
        </Container>
      </Container>
    </ErrorBoundary>
  );
};

export default SnippetDetail;
