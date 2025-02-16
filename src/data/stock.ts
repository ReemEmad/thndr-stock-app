export interface PageData {
  results: StockData;
  nextPage: number;
  hasMore: boolean;
}

export interface StockValue {
  timestamp: number;
  value: number;
  }
  
export interface StockData {
  results: {
    underlying: {
      url: string;
    };
    values: StockValue[];
  };
  status: string;
  request_id: string;
  next_url: string;
} 
