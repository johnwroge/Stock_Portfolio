import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress } from "@mui/material";
import { options } from "../utils/stocks.ts";
import StockDisplay from "./StockDisplay";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";
import { StockInfo, CreateStockResponse, SearchBarProps } from "../types/types.ts"; // Assuming you've put all interfaces in a types.ts file

const SearchBar: React.FC<SearchBarProps> = ({ setStocks, stocks }) => {
  const [symbol, setSymbol] = useState<string>("");
  const [stockPrice, setStockPrice] = useState<StockInfo | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const MAX_STOCKS = 5;

  const handlePriceSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setQuantity(0);
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
        alert(
          `You can't add more than ${MAX_STOCKS} stocks. Remove a stock and try again!`
        );
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
        if (existingStockIndex === -1 && prevStocks.length >= 5) {
          alert(
            `You can't add more than ${MAX_STOCKS} stocks. Remove a stock and try again!`
          );
          return prevStocks;
        } else if (existingStockIndex !== -1) {
          const updatedStocks = [...prevStocks];
          updatedStocks[existingStockIndex] = {
            ...updatedStocks[existingStockIndex],
            ...response.stock,
          };
          return updatedStocks;
        } else {
          alert(`Successfully added ${quantity} shares of ${symbol}`);
          return [...prevStocks, response.stock];
        }
      });

      setError(null);
      setQuantity(0);
      setStockPrice(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setSymbol("");
    }
  };

  return (
    <div
      className="search_bar"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <form onSubmit={handlePriceSearchSubmit}>
        <Stack direction="row" spacing={2}>
          <Autocomplete<Option, false, false, false>
            freeSolo
            disablePortal
            id="combo-box-demo"
            options={options}
            value={
              symbol
                ? options.find((option) => option.value === symbol) || null
                : null
            }
            onChange={(event, newValue) => {
              setSymbol(newValue?.value || "");
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Stock Ticker" />
            )}
          />

          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Stack>
      </form>
      {stockPrice && (
        <div>
          <form
            onSubmit={handleStockBuy}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
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
            isRising={
              parseFloat(stockPrice.price) >
              parseFloat(stockPrice.previous_close)
            }
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
