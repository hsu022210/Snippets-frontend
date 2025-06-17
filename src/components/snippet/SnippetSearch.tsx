import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { BsSearch, BsX } from 'react-icons/bs';
import { SnippetSearchProps } from '../../types/interfaces';
import InlineLoadingSpinner from '../InlineLoadingSpinner';

const SnippetSearch: React.FC<SnippetSearchProps> = ({
  searchTitle,
  searchCode,
  onSearchChange,
  loading = false,
}) => {
  const [searchType, setSearchType] = useState<'title' | 'code'>('title');
  const [searchValue, setSearchValue] = useState('');

  // Update search value when search type changes
  useEffect(() => {
    setSearchValue(searchType === 'title' ? searchTitle : searchCode);
  }, [searchType, searchTitle, searchCode]);

  const handleSearch = () => {
    onSearchChange(searchType === 'title' ? 'searchTitle' : 'searchCode', searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearchChange(searchType === 'title' ? 'searchTitle' : 'searchCode', '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-4">
      <Form.Group>
        <InputGroup>
          <Dropdown id="search-type-dropdown">
            <Dropdown.Toggle variant="primary">
              {searchType === 'title' ? 'Title' : 'Code'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item 
                active={searchType === 'title'}
                onClick={() => setSearchType('title')}
              >
                Title
              </Dropdown.Item>
              <Dropdown.Item 
                active={searchType === 'code'}
                onClick={() => setSearchType('code')}
              >
                Code
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search by ${searchType}...`}
          />
          {searchValue && (
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              title="Clear search"
              disabled={loading}
            >
              <BsX size={16} />
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <InlineLoadingSpinner message="Searching..." />
            ) : (
              <>
                <BsSearch size={16} />
                <span className="d-none d-sm-inline">Search</span>
              </>
            )}
          </Button>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default SnippetSearch; 