

const getSymbols = async () => {

    const response = await fetch(`http://localhost:5000/v1/stocks/symbols`);

    if (!response.ok) {
        throw new Error(`Stock data fetch for getSymbols failed`);
    }

    return response.json();

}

export default getSymbols; 