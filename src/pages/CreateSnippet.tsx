import { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import Container from '../components/shared/Container';
import CodeEditor from '../components/shared/CodeEditor';
import { useCreateSnippet } from '../hooks/useSnippet';
import { LANGUAGE_OPTIONS } from '../utils/languageUtils';

interface SnippetData {
  title: string;
  code: string;
  language: string;
}

const CreateSnippet: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const { createSnippet, loading, error } = useCreateSnippet();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const snippetData: SnippetData = { title, code, language };
    await createSnippet(snippetData);
  };

  return (
    <Container>
      <h2 className="mb-4">Create Snippet</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter snippet title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Language</Form.Label>
          <Form.Select
            value={language}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
            required
          >
            <option value="">Select language</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Code</Form.Label>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            className="mb-4"
          />
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