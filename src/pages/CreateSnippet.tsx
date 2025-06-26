import { useState, FormEvent, ChangeEvent } from 'react'
import { Form } from 'react-bootstrap'
import Button from '../components/shared/Button'
import Container from '../components/shared/Container'
import CodeEditor from '../components/shared/CodeEditor'
import { useCreateSnippet } from '../hooks/useSnippet'
import { LanguageOptions } from '../utils/languageUtils'
import { snippetDataSchema, validateFormDataWithFieldErrors, SnippetData } from '../utils/validationSchemas'

const CreateSnippet: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { createSnippet, loading } = useCreateSnippet();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const snippetData: SnippetData = { 
      title, 
      code, 
      language
    };
    
    const validation = validateFormDataWithFieldErrors(snippetDataSchema, snippetData);
    
    if (!validation.success) {
      setFormErrors(validation.fieldErrors);
      validation.generalErrors.forEach(error => console.error('Validation error:', error));
      return;
    }
    
    // Clear errors if validation passes
    setFormErrors({});
    
    await createSnippet(snippetData);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (formErrors.title) {
      setFormErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    if (formErrors.language) {
      setFormErrors(prev => ({ ...prev, language: '' }));
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (formErrors.code) {
      setFormErrors(prev => ({ ...prev, code: '' }));
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Create Snippet</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter snippet title"
            required
            isInvalid={!!formErrors.title}
          />
          {formErrors.title && (
            <Form.Control.Feedback type="invalid">
              {formErrors.title}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Language</Form.Label>
          <Form.Select
            value={language}
            onChange={handleLanguageChange}
            required
            isInvalid={!!formErrors.language}
          >
            <option value="">Select language</option>
            <LanguageOptions />
          </Form.Select>
          {formErrors.language && (
            <Form.Control.Feedback type="invalid">
              {formErrors.language}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Code</Form.Label>
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={language}
            className="mb-4"
          />
          {formErrors.code && (
            <div className="text-danger small mt-1">
              {formErrors.code}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Button
            type="submit"
            variant="outline-primary"
            disabled={loading}
            className='w-100'
          >
            {loading ? 'Creating...' : 'Create Snippet'}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default CreateSnippet; 