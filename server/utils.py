import csv

def parse_stock_csv(file_path):
    stock_dict = {}
    
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)

        for row in reader:
            symbol = row.get('symbol')
            name = row.get('name')
            
            if symbol and name:
                stock_dict[symbol] = name
                
    return stock_dict