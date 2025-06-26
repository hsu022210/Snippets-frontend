import { useState, useMemo } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
import InlineLoadingSpinner from '../components/InlineLoadingSpinner'
import { useSnippet } from '../hooks/useSnippet'
import { useToast } from '../contexts/ToastContext'
import { processCode } from '../utils/languageUtils'
import SnippetHeader from '../components/snippet/SnippetHeader'
import SnippetLanguageSelector from '../components/snippet/SnippetLanguageSelector'
import DeleteConfirmationModal from '../components/snippet/DeleteConfirmationModal'
import Container from '../components/shared/Container'
import CodeEditor from '../components/shared/CodeEditor'
import { useAuth } from '../contexts/AuthContext'
import { formatDistanceToNow, format } from 'date-fns'
import { TbClock } from 'react-icons/tb'

const SnippetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<boolean>(false);
  const { token } = useAuth();
  const { showToast } = useToast();
  const {
    snippet,
    loading,
    saving,
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
  } = useSnippet(Number(id));

  const formatCreatedTime = () => {
    try {
      if (!snippet?.created) {
        return {
          relative: 'Unknown time',
          absolute: 'Unknown time'
        };
      }
      const date = new Date(snippet.created);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        absolute: format(date, 'MMM d, yyyy h:mm a')
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      showToast('Error formatting date', 'warning');
      return {
        relative: 'Unknown time',
        absolute: 'Unknown time'
      };
    }
  };

  const processedCode = useMemo(() => {
    const codeToProcess = isEditing ? editedCode : snippet?.code;
    try {
      return processCode(codeToProcess);
    } catch (error) {
      console.error('Error processing code:', error);
      setCodeError(true);
      showToast('Error processing code content', 'warning');
      return '// Error: Could not process code content';
    }
  }, [isEditing, editedCode, snippet?.code, showToast]);

  if (loading) {
    return (
      <Container>
        <div className="center-content">
          <InlineLoadingSpinner message="Loading snippet..." />
        </div>
      </Container>
    );
  }

  if (!snippet) {
    return (
      <Container>
        <div className="center-content">
          <div className="text-center">
            <h4 className="text-muted">Snippet not found</h4>
            <p className="text-muted">The snippet you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </Container>
    );
  }

  const createdTime = formatCreatedTime();

  return (
    <ErrorBoundary>
      <Container>
        {!!token && (
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/snippets", className: "text-decoration-none" }}>
            Snippets
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {isEditing ? editedTitle : (snippet?.title || 'Untitled Snippet')}
          </Breadcrumb.Item>
        </Breadcrumb>
        )}

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
          isAuthenticated={!!token}
          snippetId={snippet.id.toString()}
        />

        <div className="d-flex flex-column gap-2 mb-3">
          <SnippetLanguageSelector
            isEditing={isEditing}
            editedLanguage={editedLanguage}
            setEditedLanguage={setEditedLanguage}
            language={snippet.language}
          />
          <div className="d-flex align-items-center gap-1 text-muted">
            <TbClock size={14} />
            <small>
              Created {createdTime.relative} 
              ({createdTime.absolute})
            </small>
          </div>
        </div>

        {codeError && (
          <div className="alert alert-warning mb-3">
            There was an issue processing the code content. The display might be affected.
          </div>
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