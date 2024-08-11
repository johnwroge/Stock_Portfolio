import React from "react";



function StockRow() {
  return (
    <div className="stock_row">
      <p>
        <strong>Symbol </strong>
      </p>
      <p>Last Price</p>
      <p>125 shares</p>
      <p> Market Value </p>
      <button>Remove</button>
    </div>
  );
}

export default StockRow;
