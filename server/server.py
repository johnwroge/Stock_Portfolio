import os
import sqlite3
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()
ALPHA_KEY = os.getenv('ALPHA_KEY')

app = Flask(__name__)

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

@app.route("/v1/stocks/tickers/<string:keywords>")
def get_tickers(keywords):
    url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keywords}&apikey={ALPHA_KEY}"
    r = requests.get(url)
    data = r.json()
    return f'<p>{data}</p>'

@app.route('/v1/stocks/<string:symbol>', methods=['GET'])
def get_stock_info(symbol):
    if request.method == 'GET':
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_KEY}'
        r = requests.get(url)
        data = r.json()
        return f'<p>{data}</p>'

@app.route('/v1/stocks/<string:symbol>', methods=['POST'])
def create_stock():
    data = request.json
    symbol = data['symbol']
    price = data['price']
    number_owned = data['number_owned']
    market_value = data['market_value']
    
    db = get_db()
    db.execute('INSERT INTO stocks (symbol, price, number_owned, market_value) VALUES (?, ?, ?, ?)',
               [symbol, price, number_owned, market_value])
    db.commit()
    return jsonify({'status': 'success'}), 201

@app.route('/v1/stocks/', methods=['GET'])
def get_stocks():
    db = get_db()
    cur = db.execute('SELECT * FROM stocks')
    stocks = cur.fetchall()
    return jsonify([dict(row) for row in stocks])

@app.route('/v1/stocks/delete/<int:id>', methods=['DELETE'])
def delete_stock(id):
    db = get_db()
    db.execute('DELETE FROM stocks WHERE id = ?', [id])
    db.commit()
    return jsonify({'status': 'success'}), 200


if __name__ == '__main__':
   init_db()
   app.run()