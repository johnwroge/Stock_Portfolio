import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress } from "@mui/material";
import { options } from "../utils/stocks";
import StockDisplay from "./StockDisplay";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";

const SearchBar = () => {
  const [symbol, setSymbol] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePriceSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getStockPrice(symbol);
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
    let { price, symbol } = stockPrice;

    const value = parseFloat(price) * quantity;
    const change_qty = parseFloat(quantity);
    price = parseFloat(price);
    const body = {
      price: price > 0 ? price : 0,
      number_owned: change_qty,
      market_value: value,
    };
    try {
      const response = await createStocks(symbol, body);
      console.log("Stock buy successful:", response);
      setError(null);
      setQuantity(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="search_bar"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <form
        onSubmit={handlePriceSearchSubmit}
        // style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Stack direction="row" spacing={2}>
          <Autocomplete
            freeSolo
            disablePortal
            id="combo-box-demo"
            options={options}
            value={options.find((option) => option.value === symbol) || null}
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
                Buy or Track
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
