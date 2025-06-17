import { Offcanvas, Button, Badge } from 'react-bootstrap';
import { Funnel } from 'react-bootstrap-icons';
import SnippetFilter from './SnippetFilter';
import { SnippetFilterSectionProps, SnippetFilterValues } from '../../types/interfaces';
import { useState } from 'react';

const SnippetFilterSection: React.FC<SnippetFilterSectionProps> = ({
  language,
  createdAfter,
  createdBefore,
  onFilterChange,
  onReset,
}) => {
  const [show, setShow] = useState(false);
  const [localFilters, setLocalFilters] = useState<SnippetFilterValues>({
    language,
    createdAfter,
    createdBefore,
  });

  const activeFiltersCount = [language, createdAfter, createdBefore].filter(Boolean).length;

  const handleClose = () => {
    setShow(false);
    // Reset local filters to match current applied filters when closing
    setLocalFilters({
      language,
      createdAfter,
      createdBefore,
    });
  };

  const handleShow = () => setShow(true);

  const handleLocalFilterChange = (newFilters: SnippetFilterValues) => {
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setShow(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      language: '',
      createdAfter: '',
      createdBefore: '',
    };
    setLocalFilters(emptyFilters);
    onReset();
    setShow(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant="outline-primary"
          onClick={handleShow}
          className="d-flex align-items-center gap-2"
        >
          <Funnel size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <Badge bg="primary" pill>
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Snippets</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column h-100">
            <div className="flex-grow-1">
              <SnippetFilter
                language={localFilters.language}
                createdAfter={localFilters.createdAfter}
                createdBefore={localFilters.createdBefore}
                onFilterChange={handleLocalFilterChange}
              />
            </div>
            <div className="border-top pt-3 mt-3">
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  disabled={activeFiltersCount === 0}
                  className="flex-grow-1"
                >
                  Reset Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApplyFilters}
                  className="flex-grow-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SnippetFilterSection; 