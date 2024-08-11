import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import StockTable from "./StockTable";
import getStocksFromDB from "../hooks/getStocksFromDB";
import deleteStocks from "../hooks/deleteStocks";

function Portfolio() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocksData = await getStocksFromDB();
        setStocks(stocksData.stocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    fetchStocks();
  }, []);

  const handleDeleteStock = async (id) => {
    try {
      await deleteStocks(id);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <>
      <div className="portfolio">
        <SearchBar onCreateStock={setStocks} />
      </div>
      <div className="portfolio">
        <StockTable
          stocks={stocks}
          onCreateStock={setStocks}
          onDeleteStock={handleDeleteStock}
          className="search_bar"
        />
      </div>
    </>
  );
}

export default Portfolio;
