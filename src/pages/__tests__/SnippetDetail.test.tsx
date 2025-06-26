import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SnippetDetail from '../SnippetDetail';
import { TestProviders } from '../../test/setup';
import { useSnippet } from '../../hooks/useSnippet';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { processCode } from '../../utils/languageUtils';
import { useParams } from 'react-router-dom';

// Mock CodeMirror (used by CodeEditor)
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value }: { value: string }) => <div data-testid="codemirror-mock">{value}</div>
}));

// Mock hooks
vi.mock('../../hooks/useSnippet');
vi.mock('../../contexts/AuthContext');
vi.mock('../../contexts/ToastContext');
vi.mock('../../utils/languageUtils');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn()
  };
});

const mockShowToast = vi.fn();
const mockSetIsEditing = vi.fn();
const mockSetEditedCode = vi.fn();
const mockSetEditedTitle = vi.fn();
const mockSetEditedLanguage = vi.fn();
const mockHandleSave = vi.fn();
const mockHandleDelete = vi.fn();
const mockHandleCancel = vi.fn();

const baseSnippet = {
  id: 1,
  title: 'Test Snippet',
  code: 'console.log("Hello World")',
  language: 'javascript',
  created: '2024-01-01T12:00:00Z',
  user: 1,
};

describe('SnippetDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ token: 'mock-token' });
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ showToast: mockShowToast });
    (processCode as ReturnType<typeof vi.fn>).mockImplementation((code) => code);
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '1' });
  });

  const renderSnippetDetail = () =>
    render(
      <TestProviders>
        <SnippetDetail />
      </TestProviders>
    );

  it('shows loading spinner when loading', () => {
    (useSnippet as ReturnType<typeof vi.fn>).mockReturnValue({ loading: true });
    renderSnippetDetail();
    // There are two elements with 'Loading snippet...' (visually-hidden and visible)
    const loadingEls = screen.getAllByText(/loading snippet/i);
    expect(loadingEls.length).toBeGreaterThanOrEqual(1);
  });

  it('shows not found message if snippet is null', () => {
    (useSnippet as ReturnType<typeof vi.fn>).mockReturnValue({ loading: false, snippet: null });
    renderSnippetDetail();
    expect(screen.getByText(/snippet not found/i)).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist or has been deleted/i)).toBeInTheDocument();
  });

  it('renders snippet details', () => {
    (useSnippet as ReturnType<typeof vi.fn>).mockReturnValue({
      snippet: baseSnippet,
      loading: false,
      saving: false,
      isEditing: false,
      editedCode: baseSnippet.code,
      editedTitle: baseSnippet.title,
      editedLanguage: baseSnippet.language,
      setIsEditing: mockSetIsEditing,
      setEditedCode: mockSetEditedCode,
      setEditedTitle: mockSetEditedTitle,
      setEditedLanguage: mockSetEditedLanguage,
      handleSave: mockHandleSave,
      handleDelete: mockHandleDelete,
      handleCancel: mockHandleCancel,
    });
    renderSnippetDetail();
    // There are two 'Test Snippet' (breadcrumb and header), so use getAllByText
    const snippetTitles = screen.getAllByText('Test Snippet');
    expect(snippetTitles.length).toBeGreaterThanOrEqual(1);
    // Look for the language label
    expect(screen.getByText('Language:')).toBeInTheDocument();
    expect(screen.getByTestId('codemirror-mock')).toHaveTextContent('console.log("Hello World")');
    expect(screen.getByText(/created/i)).toBeInTheDocument();
  });

  it('renders editing state', () => {
    (useSnippet as ReturnType<typeof vi.fn>).mockReturnValue({
      snippet: baseSnippet,
      loading: false,
      saving: false,
      isEditing: true,
      editedCode: 'edited code',
      editedTitle: 'Edited Title',
      editedLanguage: 'typescript',
      setIsEditing: mockSetIsEditing,
      setEditedCode: mockSetEditedCode,
      setEditedTitle: mockSetEditedTitle,
      setEditedLanguage: mockSetEditedLanguage,
      handleSave: mockHandleSave,
      handleDelete: mockHandleDelete,
      handleCancel: mockHandleCancel,
    });
    renderSnippetDetail();
    expect(screen.getByDisplayValue('Edited Title')).toBeInTheDocument();
    expect(screen.getByTestId('codemirror-mock')).toHaveTextContent('edited code');
    // The language is in a select dropdown, so check that it exists
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.options.length).toBeGreaterThan(0);
  });

  it('shows code error alert if processCode throws', () => {
    (processCode as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('fail'); });
    (useSnippet as ReturnType<typeof vi.fn>).mockReturnValue({
      snippet: baseSnippet,
      loading: false,
      saving: false,
      isEditing: false,
      editedCode: baseSnippet.code,
      editedTitle: baseSnippet.title,
      editedLanguage: baseSnippet.language,
      setIsEditing: mockSetIsEditing,
      setEditedCode: mockSetEditedCode,
      setEditedTitle: mockSetEditedTitle,
      setEditedLanguage: mockSetEditedLanguage,
      handleSave: mockHandleSave,
      handleDelete: mockHandleDelete,
      handleCancel: mockHandleCancel,
    });
    renderSnippetDetail();
    expect(screen.getByText(/issue processing the code content/i)).toBeInTheDocument();
    // Ignore line breaks in error string
    expect(screen.getByTestId('codemirror-mock').textContent?.replace(/\s+/g, ' ').trim()).toContain('// Error: Could not process code content');
  });
}); 