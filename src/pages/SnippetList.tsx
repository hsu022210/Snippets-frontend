import { Row, Col, Stack, Badge, Pagination } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Container from '../components/shared/Container'
import InlineLoadingSpinner from '../components/InlineLoadingSpinner'
import { useSnippetList } from '../hooks/useSnippetList'
import SnippetCard from '../components/snippet/SnippetCard'
import EmptySnippetList from '../components/snippet/EmptySnippetList'
import SnippetFilterSection from '../components/snippet/SnippetFilterSection'
import SnippetSearch from '../components/snippet/SnippetSearch'
import { getPageSize } from '../utils/pagination'
import { 
  SnippetFilterValues, 
  PaginationItemsProps,
  SnippetListHeaderProps,
  SnippetGridProps,
  PaginationControlsProps,
} from '../types'
import { useFilterState } from '../hooks/useFilterState'


const INITIAL_FILTERS: SnippetFilterValues = {
  language: '',
  createdAfter: '',
  createdBefore: '',
  searchTitle: '',
  searchCode: '',
};

const URL_PARAMS = {
  page: 'page'
} as const;

const PaginationItems: React.FC<PaginationItemsProps> = ({ totalPages, currentPage, onPageChange }) => {
  const items = [];
  for (let i = 0; i < totalPages; i++) {
    const page = i + 1;
    items.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }
  return <>{items}</>;
};

const SnippetListHeader: React.FC<SnippetListHeaderProps> = ({ totalCount, hasActiveFilters }) => (
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
    <h2 className="h3 mb-3 mb-md-0">My Snippets</h2>
    <Badge bg="secondary" className="fs-6 px-3 py-2 rounded-pill">
      {`${hasActiveFilters ? 'Filtered:' : 'Total:'} ${totalCount}`}
    </Badge>
  </div>
);

const SnippetGrid: React.FC<SnippetGridProps> = ({ snippets, filters, currentPage }) => (
  <Row xs={1} md={2} lg={3} className="g-4 mb-4">
    {snippets.map((snippet) => (
      <Col key={snippet.id}>
        <SnippetCard 
          snippet={snippet} 
          filters={filters ? {
            language: filters.language || '',
            createdAfter: filters.createdAfter || '',
            createdBefore: filters.createdBefore || '',
            searchTitle: filters.searchTitle || '',
            searchCode: filters.searchCode || '',
            page: currentPage?.toString() || ''
          } : undefined} 
        />
      </Col>
    ))}
  </Row>
);

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}) => (
  <div className="d-flex justify-content-center">
    <Pagination>
      <Pagination.Prev 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      />
      <PaginationItems
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      <Pagination.Next 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      />
    </Pagination>
  </div>
);

const SnippetList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilters, resetFilters } = useFilterState(INITIAL_FILTERS);
  
  // Initialize current page from URL or default to 1
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageParam = searchParams.get(URL_PARAMS.page);
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  
  const { snippets, totalCount, loading, hasNextPage, hasPreviousPage } = useSnippetList(filters, currentPage);

  // Update URL when page changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (currentPage > 1) {
      newSearchParams.set(URL_PARAMS.page, currentPage.toString());
    } else {
      newSearchParams.delete(URL_PARAMS.page);
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [currentPage, searchParams, setSearchParams]);

  const handleFilterChange = (newFilters: SnippetFilterValues) => {
    updateFilters({
      language: newFilters.language,
      createdAfter: newFilters.createdAfter,
      createdBefore: newFilters.createdBefore,
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (field: 'searchTitle' | 'searchCode', value: string) => {
    updateFilters({
      searchTitle: field === 'searchTitle' ? value : '',
      searchCode: field === 'searchCode' ? value : '',
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  const totalPages = Math.ceil(totalCount / getPageSize());

  if (loading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center">
        <Stack gap={2} className="text-center">
          <InlineLoadingSpinner message="Loading snippets..." />
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid>
      <SnippetListHeader totalCount={totalCount} hasActiveFilters={hasActiveFilters} />
      
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
      </div>
      
      {snippets.length > 0 ? (
        <>
          <SnippetGrid snippets={snippets} filters={filters} currentPage={currentPage} />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <EmptySnippetList />
      )}
    </Container>
  );
};

export default SnippetList; 