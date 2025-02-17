import { useState, useEffect } from 'react'
import StockSearch from './components/stock-search';
import nasdaqLogo from './assets/NASDAQ_logo.png';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <>
          <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <img 
                src={nasdaqLogo} 
                alt="Nasdaq Logo" 
                className="h-24 w-auto mb-5 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-5">StockTracker</h1>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
          <div className="fixed bottom-0 w-full py-4 text-center text-gray-600 bg-gray-100">
            Created by Reem Emad
          </div>
        </>
      ) : (
        <div className="min-h-screen">
          <StockSearch />
        </div>
      )}
    </div>
  );
}

export default App
