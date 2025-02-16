import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';
import StockSearch from './stock-search';
import { useStockSearch } from '../hooks/useStockSearch';
import { RateLimitError, ApiError } from '../services/stockApi';
import type { PageData } from '../types/stock';
import type { InfiniteData } from '@tanstack/react-query';

vi.mock('../hooks/useStockSearch');

describe('StockSearch', () => { 
  const setupMockHook = (mockData = {}) => {
    return vi.mocked(useStockSearch).mockReturnValue({
      data: {
        pages: [{
          results: { values: [] },
          nextPage: 1,
          hasMore: false
        }],
        pageParams: [null]
      } as InfiniteData<PageData>,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
      ...mockData
    } as unknown as ReturnType<typeof useStockSearch>);
  };

  beforeEach(() => {
    setupMockHook();
  });

  it('renders the search input with default value', () => {
    render(<StockSearch />);
    const input = screen.getByPlaceholderText('Search stocks...');
    expect(input).toHaveValue('AAPL');
  });

  it('updates search term on input change', async () => {
    render(<StockSearch />);
    const input = screen.getByPlaceholderText('Search stocks...') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'GOOGL' } });
    expect(input.value).toBe('GOOGL');
    
    await waitFor(() => {
      expect(useStockSearch).toHaveBeenCalledWith('GOOGL');
    }, { timeout: 600 });
  });

  it('displays loading spinner when fetching data', () => {
    setupMockHook({ isLoading: true });
    render(<StockSearch />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays stock cards when data is available', () => {
    setupMockHook({
      data: {
        pages: [{
          results: {
            values: [
              { timestamp: '2024-01-01', value: 70 },
              { timestamp: '2024-01-02', value: 65 }
            ]
          }
        }]
      }
    });

    render(<StockSearch />);
    expect(screen.getAllByTestId('stock-card')).toHaveLength(2);
  });

  it('displays rate limit error message', () => {
    setupMockHook({
      isError: true,
      error: new RateLimitError('Rate limit exceeded')
    });

    render(<StockSearch />);
    expect(screen.getByText('Rate limit exceeded. Please wait a moment before trying again.')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('displays generic API error message', () => {
    setupMockHook({
      isError: true,
      error: new ApiError('API Error occurred')
    });

    render(<StockSearch />);
    expect(screen.getByText('API Error occurred')).toBeInTheDocument();
  });

  it('shows scroll to top button when scrolled down', () => {
    render(<StockSearch />);
    const container = screen.getByRole('region');
    
    fireEvent.scroll(container, { target: { scrollTop: 300 } });
    
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });
}); 