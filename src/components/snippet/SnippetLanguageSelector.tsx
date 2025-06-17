import { Form } from 'react-bootstrap'
import { LANGUAGE_OPTIONS } from '../../utils/languageUtils'
import { SnippetLanguageSelectorProps, SnippetLanguageFilterProps } from '../../types'

type Props = SnippetLanguageSelectorProps | SnippetLanguageFilterProps;

const LanguageOptions = () => (
  <>
    {LANGUAGE_OPTIONS.map((lang) => (
      <option key={lang} value={lang}>
        {lang.charAt(0).toUpperCase() + lang.slice(1)}
      </option>
    ))}
  </>
);

const FilterLanguageSelector: React.FC<SnippetLanguageFilterProps> = ({ language, onLanguageChange }) => (
  <Form.Group>
    <Form.Label className="fw-bold">Language</Form.Label>
    <Form.Select
      value={language}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="mb-2"
      size="lg"
    >
      <option value="">All Languages</option>
      <LanguageOptions />
    </Form.Select>
    <Form.Text className="text-muted">
      Filter snippets by programming language
    </Form.Text>
  </Form.Group>
);

const EditLanguageSelector: React.FC<SnippetLanguageSelectorProps> = ({ 
  isEditing, 
  editedLanguage, 
  setEditedLanguage, 
  language 
}) => (
  <div className="mb-4">
    {isEditing ? (
      <Form.Group>
        <Form.Label><strong>Language:</strong></Form.Label>
        <Form.Select
          value={editedLanguage}
          onChange={(e) => setEditedLanguage(e.target.value)}
          className="w-auto"
        >
          <option value="">None</option>
          <LanguageOptions />
        </Form.Select>
      </Form.Group>
    ) : (
      <><strong>Language:</strong> {language || 'None'}</>
    )}
  </div>
);

const SnippetLanguageSelector: React.FC<Props> = (props) => {
  const isFilterMode = 'onLanguageChange' in props;
  return isFilterMode ? (
    <FilterLanguageSelector {...(props as SnippetLanguageFilterProps)} />
  ) : (
    <EditLanguageSelector {...(props as SnippetLanguageSelectorProps)} />
  );
};

export default SnippetLanguageSelector; 