import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastContext';
import { Share, Save, XCircle, PencilSquare, Trash } from 'react-bootstrap-icons';

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 snippet-header">
      {isEditing ? (
        <div className="d-flex align-items-center w-100">
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter snippet title"
            className="me-3"
          />
          <div className="ms-auto d-flex gap-2">
            <Button
              variant="success"
              onClick={handleSave}
              disabled={saving}
              className="d-flex align-items-center"
            >
              <Save className="me-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
              className="d-flex align-items-center"
            >
              <XCircle className="me-2" size={18} />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center w-100">
          <h2 className="mb-0">{title}</h2>
          <div className="ms-auto d-flex gap-2">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share snippet</Tooltip>}
            >
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleShare}
                className="d-flex align-items-center share-btn"
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
                  className="d-flex align-items-center"
                >
                  <PencilSquare className="me-2" size={18} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="d-flex align-items-center"
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