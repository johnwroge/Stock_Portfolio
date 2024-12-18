import { Stock } from '../types/types'; 

const getStocksFromDB = async (): Promise<{ stocks: Stock[] }> => {

    const response = await fetch(`http://localhost:5000/v1/stocks`);

    if (!response.ok) {
        throw new Error(`Stock data from database failed`);
    }

    return response.json();

}

export default getStocksFromDB; 