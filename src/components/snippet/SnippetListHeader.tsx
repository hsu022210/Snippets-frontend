import { Link } from 'react-router-dom'
import { Stack } from 'react-bootstrap'
import Button from '../shared/Button'

const SnippetListHeader: React.FC = () => {
  return (
    <>
      {/* Mobile Header */}
      <div className="d-md-none mb-4">
        <Stack gap={4} className="my-4">
          <Button
            as={Link}
            to="/create-snippet"
            variant="outline-primary"
            size="lg"
            className="w-100"
            isMobile
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
          variant="outline-primary"
        >
          Create Snippet
        </Button>
      </div>
    </>
  );
};

export default SnippetListHeader;
