const DEFAULT_PAGE_SIZE = 6;
const STORAGE_KEY = 'snippetPageSize';

export const getPageSize = (): number => {
  const savedSize = localStorage.getItem(STORAGE_KEY);
  return savedSize ? parseInt(savedSize, 10) : DEFAULT_PAGE_SIZE;
};

export const setPageSize = (size: number): void => {
  localStorage.setItem(STORAGE_KEY, size.toString());
}; 