import { DeleteStockResponse } from "../types/types";

const deleteStocks = async (id: number, symbol: string): Promise<DeleteStockResponse> => {
    const response = await fetch(`http://localhost:5000/v1/stocks/delete/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Deleting stock data for ${symbol} failed`);
    }

    return response.json();
};

export default deleteStocks;