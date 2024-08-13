
export interface Stock {
  id: number;
  market_value: number;
  number_owned: number;
  previous_close: number;
  price: number;
  symbol: string;
}

export interface StockDisplayProps {
  symbol: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  price: string;
  isRising: boolean;
  previous: string;
  change: string;
  change_percent: string;
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
export interface StockRow {
  id: number;
  symbol: string;
  price: number;
  number_owned: number;
}

export interface StockRowProps {
  stock: StockRow;
  onDeleteStock: (id: number, symbol: string) => void;
  isRising: boolean;
}

export interface CreateStockResponse {
  message: string;
  status: "success" | unknown;
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

export type TopStocks = {
  [key: string]: string;
};

export interface SearchBarProps {
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  stocks: Stock[];
}

export interface Option {
  value: string;
  label: string;
}