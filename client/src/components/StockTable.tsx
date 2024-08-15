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
import StockRow from "./StockRow";
import getStockPrice from "../hooks/getStockPrice";
import { Stock, StockInfo } from "../types/types.ts";

interface StockTableProps {
  stocks: Stock[];
  onDeleteStock: (id: number, symbol: string) => void;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  onDeleteStock,
  setStocks,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateStocks = async () => {
      try {
        setLoading(true);
        const updatedStocksData: StockInfo[] = await Promise.all(
          stocks.map((stock) => getStockPrice(stock.symbol))
        );
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

    const intervalId = setInterval(updateStocks, 18749880);
    return () => clearInterval(intervalId);
  }, [setStocks, stocks]);

  return (
    <div className="stock_table">
      {stocks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <p>There are no stocks to display.</p>
        </div>
      ) : (
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
      )}

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
};

export default StockTable;
