import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastContext';
import { Share, Save, XCircle, PencilSquare, Trash } from 'react-bootstrap-icons';
import { useState } from 'react';

const SnippetHeader = ({
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

  const [shareSnippetTooltip, setShareSnippetTooltip] = useState('Share snippet');

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
      setShareSnippetTooltip('Link copied!');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShareSnippetTooltip('Share snippet');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('Failed to copy link', 'error');
      setShareSnippetTooltip('Failed to copy link');
    }
  };

  return (
    <div className="mb-4 snippet-header">
      {isEditing ? (
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center w-100 gap-3">
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter snippet title"
            className="w-100"
          />
          <div className="d-flex gap-2 w-100 w-md-auto ms-md-auto">
            <Button
              variant="success"
              onClick={handleSave}
              disabled={saving}
              className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
            >
              <Save className="me-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="secondary"
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
                className="d-flex align-items-center share-btn flex-grow-1 flex-md-grow-0"
                aria-label="Share snippet"
              >
                <Share size={18} />
              </Button>
            </OverlayTrigger>
            {isAuthenticated && (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
                >
                  <PencilSquare className="me-2" size={18} />
                  Edit
                </Button>
                <Button
                  variant="danger"
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