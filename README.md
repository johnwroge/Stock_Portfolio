# Stock Portfolio 

This is a stock tracking project that helps users keep tabs on up to 5 stocks at one time with optional quantities. 

The backend of the application was built using a RESTful architecture design with Flask, Python, and a SQLite database and the frontend of the application was bootstrapped using Vite. The application works by sending requests to the server where the server either saves data to the database or interacts with the Alpha Vantage API. 

## Starting Backend

The backend Flask API was tested using Python 3.10. Follow these steps to setup the backend. 

If this is your first time starting the application a virtual environment is recommended to isolate dependencies. 

1. Create the virtual environment. 

`python3 -m venv venv` 

or

`python -m venv venv`

2. Activate the virtual environment. 

`source venv/bin/activate`

3. Install the dependencies

`pip install -r requirements.txt`

4. Create a new API key on Alpha Vantage (https://www.alphavantage.co/support/#api-key).The SMTP_PASSWORD can be accessed from your account settings. The email should be where you want to received notifications. Create an env file in the server directory with this information:

```env
ALPHA_KEY = AV_API_KEY
SMTP_SERVER = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER =  <email>
SMTP_PASSWORD = <password from your email provider>
USER_EMAIL = <email>
```

5. The sqlite database needs to be created. Run the server to execute the database initialization. 

`python3 server.py` 

**Note** If you choose to run the server with flask `flask --app server run`, the database will not
be initialized and will lead to errors. However, the app can be started with this command 
after the database is created . 



## Starting the frontend

1. Change into client directory

`cd client`

2. Install dependencies

`npm install`

3. Run the application in development mode 

`npm run dev`

4. Visit http://localhost:5173/ to use the application.



## Future Considerations

To enhance the application's performance, I plan to redesign it using WebSockets and a Publisher-Subscriber pattern to facilitate real-time communication and enable clients to receive immediate stock updates. We can establish a persistent connection that allows the server to push updates directly to clients by implementing a WebSocket server, which eliminates the need for frequent polling. Adopting the Publisher-Subscriber pattern will enable the server to broadcast stock changes efficiently to all subscribed clients, ensuring that users receive timely information. The client-side application will be updated to handle WebSocket connections, process incoming data in real-time, and dynamically refresh the UI to reflect the latest stock information. This approach will significantly improve the application's responsiveness and user experience by providing instantaneous updates and reducing latency. 

## Testing

Tests were written with Vitest and React Testing Library for the frontend and Pytest on the backend.

Ensure you have a virtual environment and dependencies for the server by following the setup instructions above. Additionally installing dependencies for the frontend are also required.  

## Testing

**Frontend Tests:**

Change into the Frontend Directory

`cd client`

Run Unit Tests
`npm run test`


**Backend Tests**

Change Directories:

`cd server`

Run Integration Tests

`pytest`

## Scheduler


`celery -A celery worker --loglevel=info`

`celery -A celery beat --loglevel=info`



