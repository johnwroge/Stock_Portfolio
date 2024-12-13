import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress, Alert } from "@mui/material";
import { options, top_stocks } from "../utils/stocks.ts";
import StockDisplay from "./StockDisplay";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";

interface Option {
  label: string;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setStocks, stocks }) => {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [stockPrice, setStockPrice] = useState<StockInfo | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Convert top_stocks object to array of options once
  const stockOptions: Option[] = Object.entries(top_stocks).map(([symbol, name]) => ({
    label: `${symbol} - ${name}`,
    value: symbol
  }));

  const handlePriceSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol) {
      setError("Please select a stock symbol before searching.");
      return;
    }

    setLoading(true);
    try {
      const data = await getStockPrice(symbol);
      setStockPrice(data.stock_info);
      setError(null);
    } catch (error) {
      setStockPrice(null);
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setQuantity(null);
    }
  };

  const handleStockBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockPrice) return;

    const { price, symbol, previous_close } = stockPrice;
    const value = parseFloat(price) * quantity;
    const change_qty = parseFloat(quantity.toString());
    const numericPrice = parseFloat(price);
    const numericPreviousClose = parseFloat(previous_close);

    const body = {
      price: numericPrice > 0 ? numericPrice : 0,
      number_owned: change_qty,
      market_value: value,
      previous_close: numericPreviousClose,
    };

    try {
      if (
        stocks.length >= 5 &&
        stocks.findIndex((stock) => stock.symbol === symbol) === -1
      ) {
        alert("You can't add more than 5 stocks. Remove a stock and try again!");
        return;
      }
      const response: CreateStockResponse = await createStocks(symbol, body);
      if (!response || !response.stock) {
        throw new Error("Invalid response from server");
      }

      setStocks((prevStocks) => {
        const existingStockIndex = prevStocks.findIndex(
          (stock) => stock.symbol === symbol
        );

        if (existingStockIndex !== -1) {
          const updatedStocks = [...prevStocks];
          updatedStocks[existingStockIndex] = {
            ...updatedStocks[existingStockIndex],
            ...response.stock,
          };
          return updatedStocks;
        } else {
          const message: string =
            quantity === 0
              ? `Stock ${symbol} successfully tracked!`
              : `Successfully added ${quantity} shares of ${symbol}`;
          alert(message);
          return [...prevStocks, response.stock];
        }
      });

      setError(null);
      setQuantity(0);
      setSymbol(null);
      setStockPrice(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search_bar" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <form onSubmit={handlePriceSearchSubmit}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
            disablePortal
            id="stock-search"
            options={stockOptions}
            value={stockOptions.find(opt => opt.value === symbol) || null}
            onChange={(event, newValue) => {
              setSymbol(newValue?.value || null);
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label="Stock Ticker" />
            )}
            sx={{ width: 300 }}
            filterOptions={(options, { inputValue }) => {
              const input = inputValue.toUpperCase();
              return options.filter(option => 
                option.label.toUpperCase().includes(input) ||
                option.value.includes(input)
              );
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {stockPrice && (
        <div>
          <form onSubmit={handleStockBuy} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                label="Optional Qty"
                value={quantity}
                InputProps={{
                  inputProps: { min: 0, step: "any" },
                }}
                onChange={(e) => setQuantity(Number(e.target.value))}
                sx={{ width: 300 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Buy/Track
              </Button>
            </Stack>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        stockPrice && (
          <StockDisplay
            symbol={stockPrice.symbol}
            open={stockPrice.open}
            high={stockPrice.high}
            low={stockPrice.low}
            volume={stockPrice.volume}
            price={stockPrice.price}
            isRising={parseFloat(stockPrice.price) > parseFloat(stockPrice.previous_close)}
            previous={stockPrice.previous_close}
            change={stockPrice.change}
            change_percent={stockPrice.change_percent}
          />
        )
      )}
    </div>
  );
};

export default SearchBar;
