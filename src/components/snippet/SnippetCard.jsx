import { Link } from 'react-router-dom';
import { Stack } from 'react-bootstrap';
import Card, { Body, Title, Subtitle } from '../shared/Card';
import Button from '../shared/Button';
import CodeMirror from '@uiw/react-codemirror';
import { getLanguageExtension } from '../../utils/languageUtils';

const SnippetCard = ({ snippet }) => {
  return (
    <Card hover className="h-100">
      <Body className="d-flex flex-column">
        <Stack gap={3}>
          <div>
            <Title className="mb-3">
              {snippet.title || 'Untitled Snippet'}
            </Title>
            <Subtitle className="text-muted">
              Language: {snippet.language || 'None'}
            </Subtitle>
          </div>
          
          <div className="snippet-preview flex-grow-1">
            <CodeMirror
              value={snippet.code}
              maxHeight="75px"
              theme="dark"
              editable={false}
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: false,
                bracketMatching: false,
                closeBrackets: false,
                autocompletion: false,
                rectangularSelection: false,
                crosshairCursor: false,
                highlightActiveLine: false,
                highlightSelectionMatches: false,
                closeBracketsKeymap: false,
                defaultKeymap: false,
                searchKeymap: false,
                historyKeymap: false,
                foldKeymap: false,
                completionKeymap: false,
                lintKeymap: false,
              }}
              extensions={[getLanguageExtension(snippet.language)]}
            />
          </div>

          <Button
            as={Link}
            to={`/snippets/${snippet.id}`}
            variant="outline-primary"
            className="mt-auto w-100"
          >
            View Details
          </Button>
        </Stack>
      </Body>
    </Card>
  );
};

export default SnippetCard; 