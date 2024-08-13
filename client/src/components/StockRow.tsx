import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { StockRowProps } from "../types/types.ts";

const StockRow: React.FC<StockRowProps> = ({
  stock,
  onDeleteStock,
  isRising,
}) => {
  const indicatorStyle: React.CSSProperties = {
    color: isRising ? "green" : "red",
    fontSize: "20px",
  };

  return (
    <TableRow>
      <TableCell>{stock.symbol}</TableCell>
      <TableCell>
        {stock.price} <span style={indicatorStyle}>{isRising ? "▲" : "▼"}</span>{" "}
      </TableCell>
      <TableCell>{stock.number_owned}</TableCell>
      <TableCell>{(stock.price * stock.number_owned).toFixed(2)}</TableCell>
      <TableCell>
        <IconButton
          onClick={() => onDeleteStock(stock.id, stock.symbol)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default StockRow;
