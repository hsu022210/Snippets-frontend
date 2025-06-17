import { Row, Col, Stack, Alert, Badge } from 'react-bootstrap'
import Container from '../components/shared/Container'
import InlineLoadingSpinner from '../components/InlineLoadingSpinner'
import { useSnippetList } from '../hooks/useSnippetList'
import SnippetCard from '../components/snippet/SnippetCard'
import EmptySnippetList from '../components/snippet/EmptySnippetList'
import SnippetFilterSection from '../components/snippet/SnippetFilterSection'
import SnippetSearch from '../components/snippet/SnippetSearch'
import { SnippetFilterValues } from '../types/interfaces'
import { useFilterState } from '../hooks/useFilterState'

const initialFilters: SnippetFilterValues = {
  language: '',
  createdAfter: '',
  createdBefore: '',
  searchTitle: '',
  searchCode: '',
};

const SnippetList: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useFilterState(initialFilters);
  const { snippets, totalCount, loading, error } = useSnippetList(filters);

  const handleFilterChange = (newFilters: SnippetFilterValues) => {
    updateFilters({
      language: newFilters.language,
      createdAfter: newFilters.createdAfter,
      createdBefore: newFilters.createdBefore,
    });
  };

  const handleSearchChange = (field: 'searchTitle' | 'searchCode', value: string) => {
    updateFilters({
      searchTitle: field === 'searchTitle' ? value : '',
      searchCode: field === 'searchCode' ? value : '',
    });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h2 className="h3 mb-3 mb-md-0">My Snippets</h2>
      </div>
      <SnippetSearch
        searchTitle={filters.searchTitle}
        searchCode={filters.searchCode}
        onSearchChange={handleSearchChange}
        loading={loading}
      />
      <div className="d-flex flex-column gap-2 mb-4">
        <SnippetFilterSection
          language={filters.language}
          createdAfter={filters.createdAfter}
          createdBefore={filters.createdBefore}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          loading={loading}
        />
        <div className="d-flex justify-content-start">
          <Badge bg="secondary" className="fs-6 px-3 py-2 rounded-pill">
            {`${hasActiveFilters ? 'Filtered:' : 'Total:'} ${totalCount}`}
          </Badge>
        </div>
      </div>
      
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