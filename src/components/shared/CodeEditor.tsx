import CodeMirror from '@uiw/react-codemirror'
import { getLanguageExtension } from '../../utils/languageUtils'
import { getSelectedTheme, getThemeExtension } from '../../utils/codeMirrorThemeUtils'
import { CodeEditorProps } from '../../types'
import CopyButton from './CopyButton'

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '330px',
  editable = true,
  className = '',
  theme: customTheme,
}) => {
  const selectedTheme = customTheme || getSelectedTheme();
  const theme = getThemeExtension(selectedTheme);

  return (
    <div className={className} style={{ border: '1px solid var(--bs-border-color)', borderRadius: '4px', overflow: 'hidden' }}>
      <div 
        className="d-flex justify-content-end p-2" 
        style={{ 
          backgroundColor: 'var(--bs-tertiary-bg)', 
          borderBottom: '1px solid var(--bs-border-color)' 
        }}
      >
        <CopyButton textToCopy={value} />
      </div>
      <CodeMirror
        value={value}
        height={height}
        theme={theme}
        onChange={onChange}
        extensions={getLanguageExtension(language)}
        editable={editable}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditor; 