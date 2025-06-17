import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Button from '../shared/Button'
import { BsSave, BsXCircle, BsPencilSquare, BsTrash, BsLink } from 'react-icons/bs'
import { useShareSnippet } from '../../hooks/useShareSnippet'
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
  isAuthenticated,
  snippetId
}) => {
  const { shareSnippetTooltip, handleShare } = useShareSnippet();

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
              variant="success"
              onClick={handleSave}
              disabled={saving}
              className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
            >
              <BsSave className="me-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
              className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
            >
              <BsXCircle className="me-2" size={18} />
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
                onClick={() => handleShare(snippetId)}
                className="d-flex align-items-center share-btn"
                aria-label="Share snippet"
              >
                <BsLink size={18} />
              </Button>
            </OverlayTrigger>
            {isAuthenticated && (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
                >
                  <BsPencilSquare className="me-2" size={18} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="d-flex align-items-center flex-grow-1 flex-md-grow-0"
                >
                  <BsTrash className="me-2" size={18} />
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