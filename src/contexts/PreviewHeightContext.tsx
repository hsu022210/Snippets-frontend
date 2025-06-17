import React, { createContext, useContext, useState, useEffect } from 'react';
import { PreviewHeightContextType, PreviewHeightProviderProps } from '../types/interfaces';

const PreviewHeightContext = createContext<PreviewHeightContextType | undefined>(undefined);

export const PreviewHeightProvider: React.FC<PreviewHeightProviderProps> = ({ children }) => {
  const [previewHeight, setPreviewHeight] = useState(() => {
    const savedHeight = localStorage.getItem('previewHeight');
    return savedHeight ? parseInt(savedHeight, 10) : 75;
  });

  useEffect(() => {
    localStorage.setItem('previewHeight', previewHeight.toString());
  }, [previewHeight]);

  return (
    <PreviewHeightContext.Provider value={{ previewHeight, setPreviewHeight }}>
      {children}
    </PreviewHeightContext.Provider>
  );
};

export const usePreviewHeight = () => {
  const context = useContext(PreviewHeightContext);
  if (context === undefined) {
    throw new Error('usePreviewHeight must be used within a PreviewHeightProvider');
  }
  return context;
}; 