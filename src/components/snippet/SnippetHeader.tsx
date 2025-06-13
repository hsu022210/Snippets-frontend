import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useToast } from '../../contexts/ToastContext'
import { Save, XCircle, PencilSquare, Trash, Link } from 'react-bootstrap-icons'
import { useState } from 'react'
import { SnippetHeaderProps } from '../../types/interfaces'

const SnippetHeader: React.FC<SnippetHeaderProps> = ({
  isEditing,
  editedTitle,
  setEditedTitle,
  saving,
  handleCancel,
  handleSave,
  setIsEditing,
  setShowDeleteModal,
  title,
  isAuthenticated
}) => {
  const { showToast } = useToast();
  const [shareSnippetTooltip, setShareSnippetTooltip] = useState<string>('Share snippet');

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
      setShareSnippetTooltip('Link copied!');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShareSnippetTooltip('Share snippet');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('Failed to copy link', 'danger');
      setShareSnippetTooltip('Failed to copy link');
    }
  };

  return (
    <div className="mb-4 snippet-header">
      {isEditing ? (
        <div className="d-flex flex-column flex-md-row justify-content-between w-100 gap-3">
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter snippet title"
            className="mb-0 flex-grow-0"
          />
          <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              onClick={handleSave}
              disabled={saving}
              className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
            >
              <Save className="me-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={saving}
              className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
            >
              <XCircle className="me-2" size={18} />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column flex-md-row justify-content-between w-100 gap-3">
          <h2 className="mb-0 flex-grow-0">{title}</h2>
          <div className="d-flex gap-2">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{shareSnippetTooltip}</Tooltip>}
            >
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleShare}
                className="d-flex align-items-center share-btn"
                aria-label="Share snippet"
              >
                <Link size={18} />
              </Button>
            </OverlayTrigger>
            {isAuthenticated && (
              <>
                <Button
                  variant="outline-primary"
                  onClick={() => setIsEditing(true)}
                  className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
                >
                  <PencilSquare className="me-2" size={18} />
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
                >
                  <Trash className="me-2" size={18} />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetHeader; 