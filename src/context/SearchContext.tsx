import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchHistoryItem } from '../types/weather';

interface SearchContextType {
  searchHistory: SearchHistoryItem[];
  addToHistory: (item: Omit<SearchHistoryItem, 'timestamp'>) => void;
  clearHistory: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    // Load search history from localStorage on mount
    const savedHistory = localStorage.getItem('edweather-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history from localStorage:', error);
      }
    }
  }, []);

  const addToHistory = (item: Omit<SearchHistoryItem, 'timestamp'>) => {
    const newItem: SearchHistoryItem = {
      ...item,
      timestamp: Date.now(),
    };

    setSearchHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(historyItem => 
        historyItem.city.toLowerCase() !== item.city.toLowerCase()
      );
      
      // Add new item at the beginning and limit to 10 items
      const updated = [newItem, ...filtered].slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('edweather-search-history', JSON.stringify(updated));
      
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('edweather-search-history');
  };

  return (
    <SearchContext.Provider value={{ searchHistory, addToHistory, clearHistory }}>
      {children}
    </SearchContext.Provider>
  );
};
