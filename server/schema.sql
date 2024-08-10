DROP TABLE IF EXISTS stocks;

CREATE TABLE stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    price REAL NOT NULL,
    number_owned REAL NOT NULL,
    market_value REAL NOT NULL
);
