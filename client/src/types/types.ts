export interface Stock {
    symbol: string;
    open: string;
    high: string;
    low: string;
    price: string;
    volume: string;
    latest_trading_day: string;
    previous_close: string;
    change: string;
    change_percent: string;
}

export interface StockResponse {
    stock_info: Stock;
}

export interface StockData {
    price: number;
    number_owned: number;
    market_value: number;
  }