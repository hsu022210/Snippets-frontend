import { Form } from 'react-bootstrap';
import { LANGUAGE_OPTIONS } from '../../utils/languageUtils';

const SnippetLanguageSelector = ({
  isEditing,
  editedLanguage,
  setEditedLanguage,
  language
}) => {
  return (
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
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      ) : (
        <><strong>Language:</strong> {language || 'None'}</>
      )}
    </div>
  );
};

export default SnippetLanguageSelector; 