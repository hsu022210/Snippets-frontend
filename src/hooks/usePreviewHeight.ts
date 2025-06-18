import { useState, useEffect } from 'react';

const PREVIEW_HEIGHT_KEY = 'previewHeight';
const DEFAULT_PREVIEW_HEIGHT = 75;

export const usePreviewHeight = () => {
  const [previewHeight, setPreviewHeightState] = useState(() => {
    const savedHeight = localStorage.getItem(PREVIEW_HEIGHT_KEY);
    return savedHeight ? parseInt(savedHeight, 10) : DEFAULT_PREVIEW_HEIGHT;
  });

  const setPreviewHeight = (height: number) => {
    setPreviewHeightState(height);
    localStorage.setItem(PREVIEW_HEIGHT_KEY, height.toString());
  };

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PREVIEW_HEIGHT_KEY && e.newValue) {
        setPreviewHeightState(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { previewHeight, setPreviewHeight };
}; 