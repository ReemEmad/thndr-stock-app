import { formatDate } from '../utils/dateUtils';
import { StockValue } from '../data/stock';

export const StockCard = ({ timestamp, value }: StockValue) => {
  return (
    <div data-testid="stock-card" className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="text-center space-y-2">
        <div className="text-gray-600 text-md text-left">
          {formatDate(timestamp)}
        </div>
        <div className="font-bold text-lg text-blue-500">
          {value.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
