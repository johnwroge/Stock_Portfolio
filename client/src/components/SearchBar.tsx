import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress } from "@mui/material";
import { options } from "../utils/stocks.js";
import StockDisplay from "./StockDisplay.jsx";
import getStockPrice from "../hooks/getStockPrice.tsx";
import createStocks from "../hooks/createStocks.tsx";

const SearchBar = ({ setStocks, stocks }) => {
  const [symbol, setSymbol] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const MAX_STOCKS = 5;

  const handlePriceSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getStockPrice(symbol);
      console.log(data);
      setStockPrice(data.stock_info);
      setError(null);
    } catch (error) {
      setStockPrice(null);
      setError(error.message);
    } finally {
      setLoading(false);
      setQuantity(0);
    }
  };

  const handleStockBuy = async (e) => {
    e.preventDefault();
    let { price, symbol, previous_close } = stockPrice;
    const value = parseFloat(price) * quantity;
    const change_qty = parseFloat(quantity);
    price = parseFloat(price);
    previous_close = parseFloat(previous_close);
    const body = {
      price: price > 0 ? price : 0,
      number_owned: change_qty,
      market_value: value,
      previous_close: previous_close,
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
      const response = await createStocks(symbol, body);
      if (!response || !response.stock) {
        throw new Error("Invalid response from server");
      }

      setStocks((prevStocks) => {
        const existingStockIndex = prevStocks.findIndex(
          (stock) => stock.symbol === symbol
        );
        if (existingStockIndex == -1 && prevStocks.length >= 5) {
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
      setError(error.message);
    } finally {
      setLoading(false);
      setSymbol(null);
    }
  };

  return (
    <div
      className="search_bar"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <form onSubmit={handlePriceSearchSubmit}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
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
                onChange={(e) => setQuantity(e.target.value)}
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
          <>
            <StockDisplay
              symbol={stockPrice.symbol}
              open={stockPrice.open}
              high={stockPrice.high}
              low={stockPrice.low}
              volume={stockPrice.volume}
              price={stockPrice.price}
              isRising={stockPrice.price > stockPrice.previous_close}
              previous={stockPrice.previous_close}
              change={stockPrice.change}
              change_percent={stockPrice.change_percent}
            />
          </>
        )
      )}
    </div>
  );
};

export default SearchBar;
