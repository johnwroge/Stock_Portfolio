import React from "react";

function StockDisplay({
  symbol,
  open,
  high,
  low,
  volume,
  price,
  isRising,
  previous,
  change,
  change_percent,
}) {
  const indicatorStyle = {
    color: isRising ? "green" : "red",
    fontSize: "20px", 
  };

  return (
    <div className="search_display">
      <div className="column left">
        <h3>
          {symbol} <span style={indicatorStyle}>{isRising ? "▲" : "▼"}</span>{" "}
          {price} {change} ({change_percent})
        </h3>
        <p>High:<strong>{high}</strong> </p>
        <p>Low: <strong>{low}</strong></p>
      </div>
      <div className="column middle">
       
        <p>Open:  <strong>{open}</strong> </p>
        <p>Volume: <strong>{volume}</strong></p>
      </div>
      <div className="column right">
    
        <p>Previous: <strong> {previous} </strong></p>
        <p>Change: <strong>{change} </strong> </p>
      </div>
    </div>
  );
}

export default StockDisplay;
