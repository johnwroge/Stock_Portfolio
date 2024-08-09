## Problem
Manrico would like to keep track of his stocks, but he's not happy with any of the currently available solutions. He needs a simple way to create a portfolio of up to five stocks and watch his net worth go up/down to his delight/dismay.

## Solution
You, noble web engineer, have been kind enough to help Manrico out. Create a web application that meets the following criteria:

1. *Search for an individual stock quote by symbol.*
2. *Have the ability to add a symbol (up to 5) to your portfolio and optionally, number of
shares owned. The number of shares can be left blank if a user just wanted to track
the stock.*
3. *Have the ability to remove a symbol from your portfolio.*
4. *See your entire portfolio in one view, each company showing*:
    *  Symbol
    *  Last Trade Price
    *  Number of shares owned
    *  Market value of stake (Trade price times number of shares)
5. *Save the relevant parts to the server, so if Manrico closes his browser he can revisit the site and look at his saved portfolio again. By relevant, we mean what you need to derive the data. You don't need to save trade price or other external data if you don't want to.*
6. *The portfolio should update every 5 seconds.*
7. *Extra Credit: For each company in the portfolio, alongside the last trade price show
a green up arrow or red down arrow depending on whether it's gone up or down since the last quote.*

## Resources
You can get stock quotes on the client using the following APIs:
https://www.alphavantage.co/documentation/

We took the liberty of signing you up for an API key: `PWRN1YWDMX74MVP9`. Feel free to use this one. Should it not work or have hit rate limits, you can sign up right then and there for another key.

Make sure you first visit the API URLs using your browser directly. This helps with debugging.
## The Front-end
You can use any framework you would like, or none at all. We recommend using Bootstrap for the CSS, but it's up to you entirely.

Use any paradigm you'd like. You can build a fully backend-rendered site, though you may want to consider AJAX-ifying certain parts, including widgets or other parts. Reloading the whole page to update quotes might not make for the best experience. But remember, get things working first! Then make it slick or interactive.
## The Back-end
You're free to use whichever backend you'd like. You can use any relational data store. No key/value stores.
But use whatever you're most comfortable with. And whatever will allow you to deliver readable, reliable code in the time allotted.

We are evaluating you first and foremost as a good programmer and problem solver, regardless of platform and languages.

#### Expectations
1. *Use the APIs as you see fit. See our notes on the front-end above.*
2. *Because we're framework and platform agnostic, we value clean, readable code above all else. Cleverness has its place, but readability is often more important.*
3. *The entire application is expected to run locally. All dependencies must install with a few shell commands. You should include a README.md with instructions on how to run your app locally.*
4. *Do not worry about styling or making the app flashy. If you finish early, feel free to focus on that. But the most important thing is that it works.*
5. *Do not worry about authentication, login, etc. This is a single user app and you can assume only one person will ever use it.*
6. *If you are applying for the senior role, coding some tests for the frontend and backend is expected. Focus on these after you get the application working.*
7. *Your final deliverable should be a link to your project's repo. Remember to commit often.*

#### Parting Thoughts
Manrico is a practical man, so be sure to focus on getting everything to work first before making it look good. His financial peace of mind rests in your hands. Good luck!
