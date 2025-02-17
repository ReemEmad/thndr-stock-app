import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStocksPage, RateLimitError, ApiError } from '../services/stockApi';
import { PageData } from '../types/stockData';

export const useStockSearch = (searchTerm: string) => {
  return useInfiniteQuery<PageData, ApiError, PageData, readonly unknown[]>({
    queryKey: ['stocks', searchTerm],
    queryFn: ({ pageParam }) => fetchStocksPage(searchTerm, pageParam as number),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    enabled: searchTerm.length >= 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (error instanceof RateLimitError) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 