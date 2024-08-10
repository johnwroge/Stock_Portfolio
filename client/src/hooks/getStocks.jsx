
const getStocks = async () => {

    const response = await fetch(`http://localhost:5000/v1/stocks`);

    if (!response.ok) {
        throw new Error(`Stock data fetch for ${symbol} failed`);
    }

    return response.json();

}

export default getStocks; 