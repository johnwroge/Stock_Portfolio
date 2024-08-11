import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress } from "@mui/material";
import { top_500_stocks } from "../utils/stocks";
import StockDisplay from "./StockDisplay";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";

const SearchBar = () => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = Object.entries(top_500_stocks).map(([symbol, name]) => ({
    label: `${symbol} - ${name}`,
    value: symbol,
  }));

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
    }
  };

  const handleStockBuy = async (e) => {
    e.preventDefault();
    
    try {
      const {price, symbol } = stockPrice;
      const value = parseFloat(price) * quantity;
   
      const body = {
        price: price,
        number_owned: symbol,
        market_value: value,
      };
      
      const data = await createStocks(symbol, body);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search_bar">
      <form
        onSubmit={handlePriceSearchSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
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
            <form
            onSubmit={handleStockBuy}
            style={{ display: "flex", gap: "10px", flexDirection: "column" }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                label="Optional Qty"
                value={quantity}
                InputProps={{
                  inputProps: { min: 0 },
                }}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ width: 300}}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Buy or Track
              </Button>
            </Stack>
          </form>
          </>
        )
      )}
    </div>
  );
};

export default SearchBar;
