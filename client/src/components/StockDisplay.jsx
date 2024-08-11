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
        <p>High:<strong>{parseFloat(high).toFixed(2)}</strong> </p>
        <p>Low: <strong>{parseFloat(low).toFixed(2)}</strong></p>
      </div>
      <div className="column middle">
       
        <p>Open:  <strong>{parseFloat(open).toFixed(2)}</strong> </p>
        <p>Volume: <strong>{parseFloat(volume)}</strong></p>
      </div>
      <div className="column right">
    
        <p>Previous: <strong> {parseFloat(previous).toFixed(2)} </strong></p>
        <p>Change: <strong>{parseFloat(change).toFixed(2)} </strong> </p>
      </div>
    </div>
  );
}

export default StockDisplay;
