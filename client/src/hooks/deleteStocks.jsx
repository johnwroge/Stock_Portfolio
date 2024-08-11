
const deleteStocks = async (id, symbol) => {

    const response = await fetch(`http://localhost:5000/v1/stocks/delete/${id}`, {
        method: 'DELETE',
      });

    if (!response.ok) {
        throw new Error(`Deleting stock data for ${symbol} failed`);
    }

    return response.json();

}

export default deleteStocks; 