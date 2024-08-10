
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

Run the server

`flask --app server run`



