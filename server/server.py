import os
import sqlite3
import requests
import sys
import logging
from flask import Flask, request, render_template, jsonify, current_app
from dotenv import load_dotenv
from werkzeug.exceptions import BadRequest
from utils import parse_stock_csv
from flask_cors import CORS
from email_utils import send_email


load_dotenv()
ALPHA_KEY = os.getenv('ALPHA_KEY')
user_email = os.getenv('USER_EMAIL')
app = Flask(__name__)
CORS(app)
DATABASE = 'stocks.db'

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# To record logging 
# logging.basicConfig(filename='app.log', level=logging.ERROR)

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with app.app_context():
        db = get_db()
        with open('schema.sql', mode='r') as f:
            db.execute(f.read())

@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify(error=str(e)), 400


@app.route('/v1/stocks/<string:symbol>', methods=['GET'])
def get_stock_info(symbol):
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_KEY}'
    
    try:
        r = requests.get(url)
        r.raise_for_status() 
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
        
        return jsonify({"stock_info": formatted_data}), 200
    except requests.RequestException as e:
        return jsonify({"error in get_stock_info": f"Error fetching stock data: {str(e)}"}), 500

@app.route('/v1/stocks/<string:symbol>', methods=['POST'])
def create_or_update_stock(symbol):
    try:
        data = request.json
        if not all(key in data for key in ['price', 'number_owned', 'market_value', 'previous_close']):
            raise BadRequest("Missing required fields") 
        db = get_db()
        cur = db.execute('SELECT number_owned, market_value, previous_close FROM stocks WHERE symbol = ?', [symbol])
        existing_stock = cur.fetchone()

        if existing_stock:
            new_number_owned = existing_stock['number_owned'] + data['number_owned']
            new_market_value = float(existing_stock['market_value']) + float(data['market_value'])
            db.execute('UPDATE stocks SET number_owned = ?, market_value = ?, price = ?, previous_close = ? WHERE symbol = ?',
                       [new_number_owned, new_market_value, data['price'], data['previous_close'], symbol])
            message = 'Stock updated successfully'
        else:
            db.execute('INSERT INTO stocks (symbol, price, number_owned, market_value, previous_close) VALUES (?, ?, ?, ?, ?)',
                       [symbol, data['price'], data['number_owned'], data['market_value'], data['previous_close']])
            message = 'Stock created successfully'
        db.commit()

        cur = db.execute('SELECT * FROM stocks WHERE symbol = ?', [symbol])
        updated_stock = cur.fetchone()

        email_body = f"Stock '{symbol}' has been updated/created successfully.\n\nDetails:\n{updated_stock}"
        send_email(f'{user_email}', "Stock Update Notification", email_body)


        return jsonify({
            'status': 'success',
            'message': message,
            'stock': {
                'id': updated_stock['id'],
                'symbol': updated_stock['symbol'],
                'price': updated_stock['price'],
                'number_owned': updated_stock['number_owned'],
                'market_value': updated_stock['market_value'],
                'previous_close': updated_stock['previous_close']
            }
        }), 201
    
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

        email_body = f"Stock with ID '{id}' has been deleted successfully."
        send_email(user_email, "Stock Deletion Notification", email_body)

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

@app.route('/test-email', methods=['GET'])
def test_email():
    subject = "Test Email Subject"
    to_address = user_email
    html_content = render_template('email_template.html')  # Assuming 'email_template.html' is your HTML template
    
    success = send_email(to_address, subject, html_content)
    if success:
        return "Test email sent successfully!", 200
    else:
        return "Failed to send test email.", 500



if __name__ == '__main__':
   init_db()
   app.run(debug=True)
    