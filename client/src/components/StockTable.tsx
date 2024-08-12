import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import StockRow from "./StockRow.jsx";
import getStockPrice from "../hooks/getStockPrice.tsx";

function StockTable({ stocks, onDeleteStock, setStocks }) {
  // const [symbol, setSymbol] = useState<string>("");
  // const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateStocks = async () => {
      try {
        setLoading(true);
        const updatedStocksData = await Promise.all(
          stocks.map((stock) => getStockPrice(stock.symbol))
        );
        console.log(updatedStocksData);
        setStocks((prevStocks) =>
          prevStocks.map((stock, index) => ({
            ...stock,
            ...updatedStocksData[index].stock_info,
          }))
        );
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error("Error updating stocks:", error);
        setError("Failed to update stock prices. Please try again later.");
      }
    };
    // This line can be updated to fetch updated stock information every 5 seconds by changing the second argument to 5000. 
    // **Note** the API key will need to upgraded to allow the app to continue working. There is a 25 daily request limit otherwise. 
    const intervalId = setInterval(updateStocks, 18749880);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="stock_table">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="stock table">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Last Trade Price</TableCell>
              <TableCell>Number of Shares Owned</TableCell>
              <TableCell>Market Value of Stake</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <StockRow
                key={stock.id}
                stock={stock}
                onDeleteStock={onDeleteStock}
                isRising={stock.price > stock.previous_close}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default StockTable;
