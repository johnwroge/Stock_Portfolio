
export interface Stock {
  id: number;
  market_value: number;
  number_owned: number;
  previous_close: number;
  price: number;
  symbol: string;
}

export interface CreateStockResponse {
  message: string;
  status: "success";
  stock: Stock;
}

export interface StockResponse {
  stock_info: Stock;
}

export interface StockData {
  price: number;
  number_owned: number;
  market_value: number;
}

export interface DeleteStockResponse {
  message: string;
  status: "success" | unknown;
}

export interface StockInfo {
  change: string;
  change_percent: string;
  high: string;
  latest_trading_day: string;
  low: string;
  open: string;
  previous_close: string;
  price: string;
  symbol: string;
  volume: string;
}
