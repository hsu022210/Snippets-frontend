import { Form, Button } from 'react-bootstrap';

const SnippetHeader = ({
  isEditing,
  editedTitle,
  setEditedTitle,
  saving,
  handleCancel,
  handleSave,
  setIsEditing,
  setShowDeleteModal,
  title
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {isEditing ? (
        <div className="d-flex align-items-center flex-grow-1">
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter snippet title"
            className="me-3"
          />
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
            className="me-2"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      ) : (
        <>
          <h2 className="mb-0">{title || 'Untitled Snippet'}</h2>
          <div className="d-flex gap-2">
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
          </div>
        </>
      )}
    </div>
  );
};

export default SnippetHeader; 