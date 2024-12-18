import { StockInfo } from "../types/types.ts";

const getStockPrice = async (symbol: string): Promise<StockInfo> => {

  const response = await fetch(`http://localhost:5000/v1/stocks/${symbol}`);

  if (!response.ok) {
    throw new Error(`Stock data fetch for ${symbol} failed`);
  }

  return response.json();
};

export default getStockPrice;
