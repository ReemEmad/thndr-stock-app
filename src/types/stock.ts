export interface StockValue {
  timestamp: string;
  value: number;
}

export interface StockResults {
  results: {
    values: StockValue[];
  };
}

export interface PageData {
  results: {
    values: StockValue[];
  };
  nextPage: number;
  hasMore: boolean;
} 