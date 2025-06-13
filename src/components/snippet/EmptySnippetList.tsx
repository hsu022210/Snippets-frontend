import { Link } from 'react-router-dom'
import { Stack } from 'react-bootstrap'
import Card, { Body, Text } from '../shared/Card'
import Button from '../shared/Button'

const EmptySnippetList: React.FC = () => {
  return (
    <Card className="text-center">
      <Body>
        <Stack gap={3} className="align-items-center">
          <Text>No snippets found. Create your first snippet!</Text>
          <Button
            as={Link}
            to="/create-snippet"
            variant="outline-primary"
          >
            Create Snippet
          </Button>
        </Stack>
      </Body>
    </Card>
  );
};

export default EmptySnippetList; 