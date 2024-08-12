import { useState, useEffect } from "react";
import SearchBar from "./SearchBar.tsx";
import StockTable from "./StockTable.js";
import getStocksFromDB from "../hooks/getStocksFromDB.tsx";
import deleteStocks from "../hooks/deleteStocks.js";
import { Stock } from "../types/types.ts";

function Portfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);

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

  const handleDeleteStock = async (id: number, symbol: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await deleteStocks(id, symbol);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
      alert(`${symbol} successfully removed from portfolio`);
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <>
      <div className="portfolio">
        <SearchBar setStocks={setStocks} stocks={stocks} />
      </div>
      <div className="portfolio">
        <StockTable
          stocks={stocks}
          onDeleteStock={handleDeleteStock}
          setStocks={setStocks}
          // @ts-ignore
          className="search_bar"
        />
      </div>
    </>
  );
}

export default Portfolio;
