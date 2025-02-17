import React, { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { MagnifyingGlassIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { StockCard } from './stock-card';
import { useStockSearch } from '../hooks/useStockSearch';
import { RateLimitError, ApiError } from '../services/stockApi';
import type { InfiniteData } from '@tanstack/react-query';
import type { PageData } from '../types/stockData';

function StockSearch() {
  const [searchTerm, setSearchTerm] = useState('AAPL');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useStockSearch(searchTerm);

  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setSearchTerm(term.toUpperCase());
    }, 500),
    []
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const allStocks = (data as unknown as InfiniteData<PageData>)?.pages.flatMap(page => page.results.results.values) ?? [];

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    setShowScrollTop(scrollTop > 200);

    // Check if we're near the bottom (within 200px)
    const scrollPosition = scrollTop + clientHeight;
    const scrollThreshold = scrollHeight - 200;

    if (scrollPosition >= scrollThreshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollToTop = () => {
    const container = document.querySelector('.scroll-container');
    container?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isError) {
    const errorMessage = error instanceof RateLimitError 
      ? 'Rate limit exceeded. Please wait a moment before trying again.'
      : error instanceof ApiError 
        ? error.message
        : 'An error occurred while fetching data';

    return (
      <div className="error-container">
        <p className="error-message m-auto">{errorMessage}</p>
        {error instanceof RateLimitError && (
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-2 py-2 rounded-md m-auto hover:cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="h-screen overflow-y-auto bg-gray-50 p-4 md:p-8 scroll-container relative"
      onScroll={handleScroll}
      role="region"
      aria-label="Stock search results"
    >
        <div className="max-w-xl mx-auto pb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search stocks..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
    
        <div className="max-w-7xl mx-auto px-4 mb-6 text-2xl">
          <div className="text-gray-900">
            <h1 className="font-bold mb-2">{searchTerm} RSI Analysis</h1>
            <p className="text-gray-600">Relative Strength Index (RSI) values</p>
          </div>
        </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
        {allStocks.map((value, index) => (
          <StockCard
            key={index}
            timestamp={value.timestamp}
            value={value.value}
          />
        ))}
      </div>

      {isLoading && (
        <div data-testid="loading-spinner" className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default StockSearch; 