import { PageData } from "../types/stockData";

export const API_CONFIG = {
  KEY: import.meta.env.VITE_POLYGON_API_KEY,
  URL: import.meta.env.VITE_POLYGON_API_URL,
  ITEMS_PER_PAGE: 20
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'API rate limit exceeded. Please try again later.') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export const fetchStocksPage = async (searchTerm: string, pageParam = 1): Promise<PageData> => {
  try {
    const response = await fetch(
      `${API_CONFIG.URL}${searchTerm}?timespan=day&adjusted=true&window=14&series_type=close&order=desc&limit=${API_CONFIG.ITEMS_PER_PAGE}&apiKey=${API_CONFIG.KEY}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError();
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'An error occurred while fetching data',
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    
    if (!data.results) {
      throw new ApiError('Invalid response format from API');
    }

    return {
      results: data.results,
      nextPage: pageParam + 1,
      hasMore: data.results?.values?.length === API_CONFIG.ITEMS_PER_PAGE,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}; 