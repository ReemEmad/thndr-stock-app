import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStocksPage, RateLimitError, ApiError } from '../services/stockApi';
import { PageData } from '../data/stock';

export const useStockSearch = (searchTerm: string) => {
  return useInfiniteQuery<PageData, ApiError>({
    queryKey: ['stocks', searchTerm],
    queryFn: ({ pageParam }) => fetchStocksPage(searchTerm, pageParam),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: searchTerm.length >= 1,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
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