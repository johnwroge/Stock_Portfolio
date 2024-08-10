import os
import sqlite3
import requests
from flask import Flask, request, jsonify, current_app
from dotenv import load_dotenv
from werkzeug.exceptions import BadRequest
from utils import parse_stock_csv
from flask_cors import CORS


load_dotenv()
ALPHA_KEY = os.getenv('ALPHA_KEY')
app = Flask(__name__)
CORS(app)
DATABASE = 'stocks.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with app.app_context():
        db = get_db()
        with open('schema.sql', mode='r') as f:
            db.executescript(f.read())

@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify(error=str(e)), 400

# @app.route("/v1/stocks/tickers/<string:keywords>")
# def get_tickers(keywords):
#     url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keywords}&apikey={ALPHA_KEY}"
    
#     try:
#         r = requests.get(url)
#         r.raise_for_status()  
#         data = r.json()
#         return jsonify(data), 200
    
#     except requests.RequestException as e:
#         return jsonify({"error": f"Error fetching ticker data: {str(e)}"}), 500

@app.route('/v1/stocks/symbols', methods=['GET'])
def get_list_of_symbols():
    try:
        current_directory = os.getcwd()
        filename = 'listing_status.csv'
        full_path = os.path.join(current_directory, filename)
        symbols = parse_stock_csv(full_path)
        return jsonify({"symbols": symbols}), 200
    except Exception as e:
        return jsonify({"error in get_list_of_symbols": str(e)}), 500


@app.route('/v1/stocks/<string:symbol>', methods=['GET'])
def get_stock_info(symbol):
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_KEY}'
    try:
        r = requests.get(url)
        r.raise_for_status()  # Raises an HTTPError for bad responses
        data = r.json()
        quote_data = data.get('Global Quote', {})
        if not quote_data:
            return jsonify({"error in get_stock_info": "No data found for the given symbol"}), 404
        
        formatted_data = {
            "symbol": quote_data.get('01. symbol'),
            "open": quote_data.get('02. open'),
            "high": quote_data.get('03. high'),
            "low": quote_data.get('04. low'),
            "price": quote_data.get('05. price'),
            "volume": quote_data.get('06. volume'),
            "latest_trading_day": quote_data.get('07. latest trading day'),
            "previous_close": quote_data.get('08. previous close'),
            "change": quote_data.get('09. change'),
            "change_percent": quote_data.get('10. change percent')
        }
        print(formatted_data)
        return jsonify({"stock_info": formatted_data}), 200
    except requests.RequestException as e:
        return jsonify({"error in get_stock_info": f"Error fetching stock data: {str(e)}"}), 500


@app.route('/v1/stocks/<string:symbol>', methods=['POST'])
def create_or_update_stock(symbol):
    try:
        data = request.json
        if not all(key in data for key in ['price', 'number_owned', 'market_value']):
            raise BadRequest("Missing required fields") 
        db = get_db()
        cur = db.execute('SELECT number_owned, market_value FROM stocks WHERE symbol = ?', [symbol])
        existing_stock = cur.fetchone()

        if existing_stock:
            new_number_owned = existing_stock['number_owned'] + data['number_owned']
            new_market_value = existing_stock['market_value'] + data['market_value']
            db.execute('UPDATE stocks SET number_owned = ?, market_value = ? WHERE symbol = ?',
                       [new_number_owned, new_market_value, symbol])
            message = 'Stock updated successfully'
        else:
            db.execute('INSERT INTO stocks (symbol, price, number_owned, market_value) VALUES (?, ?, ?, ?)',
                       [symbol, data['price'], data['number_owned'], data['market_value']])
            message = 'Stock created successfully'
        db.commit()
        return jsonify({'status': 'success', 'message': message}), 201
    
    except sqlite3.Error as e:
        logger.error(f"Database error in create_or_update_stock: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error in create_or_update_stock: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500



@app.route('/v1/stocks/delete/<int:id>', methods=['DELETE'])
def delete_stock(id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('DELETE FROM stocks WHERE id = ?', [id])
        if cursor.rowcount == 0:
            return jsonify({'status': 'not found', 'message': 'No stock found with the given ID'}), 404
        db.commit()
        return jsonify({'status': 'success', 'message': f'Stock {id} deleted successfully'}), 200
    
    except Exception as e:
        db.rollback()
        current_app.logger.error(f"Error deleting stock with ID {id}: {e}")      
        return jsonify({'status': 'error', 'message': 'An error occurred while deleting the stock'}), 500 
    finally:
        if cursor:
            cursor.close()

@app.route('/v1/stocks', methods=['GET'])
def get_stocks():
    try:
        db = get_db()
        cur = db.execute('SELECT * FROM stocks')
        stocks = cur.fetchall()    
        if not stocks:
            return jsonify({"message": "No stocks found", "stocks": []}), 200 
        return jsonify({"stocks": [dict(row) for row in stocks]}), 200
    except sqlite3.Error as e:
        app.logger.error(f"Database error in get_stocks: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error in get_stocks: {e}")
        return jsonify({"error": "An unexpected error occurred in get_stocks"}), 500

if __name__ == '__main__':
   init_db()
   app.run()