import { Link } from 'react-router-dom'
import { Stack, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Card, { Body, Title, Subtitle } from '../shared/Card'
import Button from '../shared/Button'
import CodeMirror from '@uiw/react-codemirror'
import { getLanguageExtension, getLanguageDisplayName } from '../../utils/languageUtils'
import { getSelectedTheme, getThemeExtension } from '../../utils/codeMirrorThemeUtils'
import { usePreviewHeight } from '../../hooks/usePreviewHeight'
import { useShareSnippet } from '../../hooks/useShareSnippet'
import { useTheme } from '../../contexts/ThemeContext'
import { useToast } from '../../contexts/ToastContext'
import { SnippetCardProps } from '../../types'
import { TbLink, TbClock } from 'react-icons/tb'
import { formatDistanceToNow } from 'date-fns'

export const SnippetCard = ({ snippet, filters }: SnippetCardProps) => {
  const selectedTheme = getSelectedTheme();
  const { previewHeight } = usePreviewHeight();
  const { shareSnippetTooltip, handleShare } = useShareSnippet();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const theme = getThemeExtension(selectedTheme);

  const formatCreatedTime = () => {
    try {
      if (!snippet.created) return 'Unknown time';
      return formatDistanceToNow(new Date(snippet.created), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      showToast('Error formatting date', 'warning');
      return 'Unknown time';
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleShare(snippet.id.toString());
  };

  return (
    <Link 
      to={`/snippets/${snippet.id.toString()}`} 
      state={filters ? { filters } : undefined}
      className="text-decoration-none"
    >
      <Card hover className="h-100">
        <Body className="d-flex flex-column">
          <Stack gap={3}>
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Title className={`mb-0 ${isDark ? 'text-light' : 'text-dark'}`}>
                  {snippet.title || 'Untitled Snippet'}
                </Title>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{shareSnippetTooltip}</Tooltip>}
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleShareClick}
                    className="d-flex align-items-center share-btn"
                    aria-label="Share snippet"
                  >
                    <TbLink size={18} />
                  </Button>
                </OverlayTrigger>
              </div>
              <div className="d-flex flex-column gap-1 text-muted">
                <Subtitle className="mb-0">
                  Language: {getLanguageDisplayName(snippet.language)}
                </Subtitle>
                <div className="d-flex align-items-center gap-1">
                  <TbClock size={14} />
                  <small>{formatCreatedTime()}</small>
                </div>
              </div>
            </div>
            
            <div className="snippet-preview flex-grow-1">
              <CodeMirror
                value={snippet.code}
                maxHeight={`${previewHeight}px`}
                theme={theme}
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
                extensions={getLanguageExtension(snippet.language)}
              />
            </div>
          </Stack>
        </Body>
      </Card>
    </Link>
  );
};

export default SnippetCard; 