import { useState } from 'react';
import { Row, Col, Stack, Alert } from 'react-bootstrap'
import Container from '../components/shared/Container'
import InlineLoadingSpinner from '../components/InlineLoadingSpinner'
import { useSnippetList } from '../hooks/useSnippetList'
import SnippetCard from '../components/snippet/SnippetCard'
import EmptySnippetList from '../components/snippet/EmptySnippetList'
import SnippetFilterSection from '../components/snippet/SnippetFilterSection'
import SnippetSearch from '../components/snippet/SnippetSearch'
import { SnippetFilterValues } from '../types/interfaces'

const SnippetList: React.FC = () => {
  const [filters, setFilters] = useState<SnippetFilterValues>({
    language: '',
    createdAfter: '',
    createdBefore: '',
    searchTitle: '',
    searchCode: '',
  });

  const { snippets, loading, error } = useSnippetList(filters);

  const handleFilterChange = (newFilters: SnippetFilterValues) => {
    setFilters(prev => ({
      ...prev,
      language: newFilters.language,
      createdAfter: newFilters.createdAfter,
      createdBefore: newFilters.createdBefore,
    }));
  };

  const handleSearchChange = (field: 'searchTitle' | 'searchCode', value: string) => {
    setFilters(prev => ({
      ...prev,
      searchTitle: field === 'searchTitle' ? value : '',
      searchCode: field === 'searchCode' ? value : '',
    }));
  };

  const handleResetFilters = () => {
    setFilters(prev => ({
      ...prev,
      language: '',
      createdAfter: '',
      createdBefore: '',
    }));
  };

  if (loading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center">
        <Stack gap={2} className="text-center">
          <InlineLoadingSpinner message="Loading snippets..." />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="h3 mb-4">My Snippets</h2>
      <SnippetSearch
        searchTitle={filters.searchTitle}
        searchCode={filters.searchCode}
        onSearchChange={handleSearchChange}
      />
      <SnippetFilterSection
        language={filters.language}
        createdAfter={filters.createdAfter}
        createdBefore={filters.createdBefore}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      
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