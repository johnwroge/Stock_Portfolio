import React, { useEffect, useState } from "react";
import createStocks from "../hooks/createStocks";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Stack, CircularProgress } from "@mui/material";
import StockRow from "./StockRow";
import { options } from "../utils/stocks";

function StockTable({ stocks, onDeleteStock }) {
  const [symbol, setSymbol] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // *  Symbol
  // *  Last Trade Price
  // *  Number of shares owned
  // *  Market value of stake (Trade price times number of shares)

const display = stocks.map((stock, idx) => (
  <ul style={{display: 'flex', flexDirection: 'row', gap: '20px'}} key = {idx}> 
    <p> {stock.id} </p>
    <p> {stock.market_value} </p>
    <p> {stock.number_owned} </p>
    <p> {stock.symbol} </p>
    <p> {stock.price}  </p>
  </ul>
))

console.log(stocks)
  return (
    <div className="stock_table">
      <div className="search_bar">
      {display}
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
          <></>
        )}
      </div>
    </div>
  );
}

export default StockTable;
