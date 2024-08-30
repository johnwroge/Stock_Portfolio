import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress, Alert } from "@mui/material";
import { options, top_stocks } from "../utils/stocks.ts";
import StockDisplay from "./StockDisplay";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";
import { TopStocks } from "../utils/stocks.ts";
import {
  StockInfo,
  CreateStockResponse,
  SearchBarProps,
} from "../types/types.ts";

const SearchBar: React.FC<SearchBarProps> = ({ setStocks, stocks }) => {
  const [symbol, setSymbol] = useState<null | string>(null);
  const [stockPrice, setStockPrice] = useState<StockInfo | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [new_options, setOptions] = useState<any>(options);

  const MAX_STOCKS = 5;

  const handlePriceSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(symbol)
    debugger;
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
      setSymbol(null);
    }
  };

  const handleOptions = (e) => {
    if (e != null) {
      let stock = e.target.value;
      console.log(typeof stock);

      const upper_case = stock.toUpperCase();
      const name_of_company = top_stocks[upper_case];
      if (name_of_company) {
        const mock = {
          label: `${upper_case} - ${name_of_company}`,
          value: upper_case,
        };
        setOptions([mock]);
      }
    } else {
      setOptions([]);
    }
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.symbol,
  });
  

  return (
    <div
      className="search_bar"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <form onSubmit={handlePriceSearchSubmit}>
        <Stack direction="row" spacing={2}>
          {/* this is causing an error */}
          <Autocomplete<Option, false, false, false>
            disablePortal
            id="combo-box-demo"
            getOptionLabel={(option) => option.title}
            options={new_options}
            value={symbol}
            onChange={(event, newValue) => {
              setSymbol(newValue?.value || null);
            }}
            onInputChange={(event) => {
              handleOptions(event);
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
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
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
            alignItems: "center",
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
