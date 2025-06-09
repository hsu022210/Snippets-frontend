import CodeMirror from '@uiw/react-codemirror';
import { getLanguageExtension } from '../../utils/languageUtils';
import { useCodeMirrorTheme } from '../../contexts/CodeMirrorThemeContext';
import * as themes from '@uiw/codemirror-themes-all';

const CodeEditor = ({
  value,
  onChange,
  language,
  height = '330px',
  editable = true,
  className = '',
}) => {
  const { selectedTheme } = useCodeMirrorTheme();
  const theme = themes[selectedTheme] || themes.default;

  return (
    <div className={className} style={{ border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
      <CodeMirror
        value={value}
        height={height}
        theme={theme}
        onChange={onChange}
        extensions={[getLanguageExtension(language)]}
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