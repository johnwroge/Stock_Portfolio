import os
import sqlite3
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()
ALPHA_KEY = os.getenv('ALPHA_KEY')

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
   app.run()