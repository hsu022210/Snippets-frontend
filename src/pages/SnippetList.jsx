import { Row, Col, Stack, Alert } from 'react-bootstrap';
import Container from '../components/shared/Container';
import InlineLoadingSpinner from '../components/InlineLoadingSpinner';
import { useSnippetList } from '../hooks/useSnippetList';
import SnippetListHeader from '../components/snippet/SnippetListHeader';
import SnippetCard from '../components/snippet/SnippetCard';
import EmptySnippetList from '../components/snippet/EmptySnippetList';

const SnippetList = () => {
  const { snippets, loading, error } = useSnippetList();

  if (loading) {
    return (
      <Container fluid pageContainer className="d-flex align-items-center justify-content-center">
        <Stack gap={2} className="text-center">
          <InlineLoadingSpinner message="Loading snippets..." />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid pageContainer className="d-flex align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid pageContainer>
      <SnippetListHeader />
      
      {snippets.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {snippets.map((snippet) => (
            <Col key={snippet.id}>
              <SnippetCard snippet={snippet} />
            </Col>
          ))}
        </Row>
      ) : (
        <EmptySnippetList />
      )}
    </Container>
  );
};

export default SnippetList; 