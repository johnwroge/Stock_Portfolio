import { CreateStockResponse, Stock } from '../types/types.ts'

const createStocks = async (symbol: string, stockData: Partial<Stock>): Promise<CreateStockResponse> => {
  const response = await fetch(`http://localhost:5000/v1/stocks/${symbol}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(stockData),
  });

  if (!response.ok) {
      throw new Error(`Failed to create or update stock for symbol ${symbol}`);
  }

  return response.json();
};

export default createStocks;