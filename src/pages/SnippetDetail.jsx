import { useState, useMemo } from 'react';
import { Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import InlineLoadingSpinner from '../components/InlineLoadingSpinner';
import { useSnippet } from '../hooks/useSnippet';
import { processCode } from '../utils/languageUtils';
import SnippetHeader from '../components/snippet/SnippetHeader';
import SnippetLanguageSelector from '../components/snippet/SnippetLanguageSelector';
import DeleteConfirmationModal from '../components/snippet/DeleteConfirmationModal';
import Container from '../components/shared/Container';
import CodeEditor from '../components/shared/CodeEditor';

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
      <Container>
        <div className="center-content">
          <InlineLoadingSpinner message="Loading snippet..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="center-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </Container>
    );
  }

  if (!snippet) {
    return (
      <Container>
        <div className="center-content">
          <Alert variant="warning">Snippet not found</Alert>
        </div>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container>
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

        <CodeEditor
          value={processedCode}
          onChange={(value) => isEditing && setEditedCode(value)}
          language={isEditing ? editedLanguage : snippet.language}
          height="400px"
          editable={isEditing}
          className="mb-4"
        />

        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default SnippetDetail;
