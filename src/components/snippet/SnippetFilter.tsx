import { Form, Stack } from 'react-bootstrap';
import SnippetLanguageSelector from './SnippetLanguageSelector';
import { SnippetFilterProps } from '../../types/interfaces';

const SnippetFilter: React.FC<SnippetFilterProps> = ({
  language,
  createdAfter,
  createdBefore,
  onFilterChange,
}) => {
  const handleLanguageChange = (newLanguage: string) => {
    onFilterChange({
      language: newLanguage,
      createdAfter,
      createdBefore,
    });
  };

  const handleDateChange = (field: 'createdAfter' | 'createdBefore', value: string) => {
    onFilterChange({
      language,
      createdAfter: field === 'createdAfter' ? value : createdAfter,
      createdBefore: field === 'createdBefore' ? value : createdBefore,
    });
  };

  return (
    <Stack gap={4}>
      <SnippetLanguageSelector
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <Form.Group>
        <Form.Label className="fw-bold">Date Range</Form.Label>
        <Stack gap={3}>
          <div>
            <Form.Label>Created After</Form.Label>
            <Form.Control
              type="date"
              value={createdAfter}
              onChange={(e) => handleDateChange('createdAfter', e.target.value)}
              className="mb-2"
            />
            <Form.Text className="text-muted">
              Show snippets created after this date
            </Form.Text>
          </div>
          <div>
            <Form.Label>Created Before</Form.Label>
            <Form.Control
              type="date"
              value={createdBefore}
              onChange={(e) => handleDateChange('createdBefore', e.target.value)}
              className="mb-2"
            />
            <Form.Text className="text-muted">
              Show snippets created before this date
            </Form.Text>
          </div>
        </Stack>
      </Form.Group>
    </Stack>
  );
};

export default SnippetFilter; 