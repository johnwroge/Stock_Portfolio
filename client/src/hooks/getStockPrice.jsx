const getStockPrice = async (symbol) => {
    console.log("in get stock price")
    const response = await fetch(`http://localhost:5000/v1/stocks/${symbol}`);
    console.log(response)
    if (!response.ok) {
        throw new Error(`Stock data fetch for ${symbol} failed`);
    }

    return response.json();

}

export default getStockPrice; 