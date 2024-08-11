
## Starting Backend

The backend Flask API uses Python 3.10. 

Create the virtual environment. 

`python3 -m venv venv` 

or

`python -m venv venv`

Activate the virtual environment. 

`source venv/bin/activate`

Install the dependencies

`pip install -r requirements.txt`

Create an env file in the server directory with this information:

```bash
ALPHA_KEY=PWRN1YWDMX74MVP9
```

If this is the first time running the backend, the sqlite database needs to be initialized. Run the server with. 

`python3 server.py` 

If you choose to run the server with flask `flask --app server run`, the database will not
be initialized and will lead to errors. However, after the database is initialized the app can be started with this command. 


## Starting the frontend


`cd client`

`npm install`

`npm run dev`






