import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';
import { SnippetSearchProps } from '../../types/interfaces';

const SnippetSearch: React.FC<SnippetSearchProps> = ({
  searchTitle,
  searchCode,
  onSearchChange,
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
            <Dropdown.Toggle variant="secondary">
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
            placeholder={`Search snippets by ${searchType}...`}
          />
          {searchValue && (
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              title="Clear search"
            >
              <X size={16} />
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={!searchValue}
            className="d-flex align-items-center gap-2"
          >
            <Search size={16} />
            Search
          </Button>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default SnippetSearch; 