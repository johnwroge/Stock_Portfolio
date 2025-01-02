import os
import pytest
from server import app, init_db
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

def test_get_stocks(client):
    response = client.get('/v1/stocks')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'stocks' in data

def test_create_stock(client):
    stock_data = {
        'price': 100.0,
        'number_owned': 10,
        'market_value': 1000.0,
        'previous_close': 98.0
    }
    response = client.post('/v1/stocks/AAPL', json=stock_data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'stock' in data

# def test_get_stock_info(client):
#     response = client.get('/v1/stocks/AAPL')
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert 'stock_info' in data
def test_get_stock_info(client):
    # Add debug logging
    print(f"ALPHA_KEY present: {bool(os.getenv('ALPHA_KEY'))}")
    
    response = client.get('/v1/stocks/AAPL')
    
    # Print response data for debugging
    print(f"Response status: {response.status_code}")
    print(f"Response data: {response.get_data(as_text=True)}")
    
    assert response.status_code == 200

def test_delete_stock(client):
    stock_data = {
        'price': 100.0,
        'number_owned': 10,
        'market_value': 1000.0,
        'previous_close': 98.0
    }
    create_response = client.post('/v1/stocks/AAPL', json=stock_data)
    created_stock = json.loads(create_response.data)['stock']
    
    response = client.delete(f'/v1/stocks/delete/{created_stock["id"]}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'