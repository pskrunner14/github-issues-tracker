# GitHub Issues Tracker

[![Demo on Heroku](./extra/demo.svg)](https://github-issues-tracker.herokuapp.com/) [![Hackage-Deps](https://img.shields.io/hackage-deps/v/lens.svg)](https://github.com/pskrunner14/github-issues-tracker/network/dependencies)

This application tracks the number of issues for any GitHub Public Repository for various different timeframes. It is built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) and [Cheerio](https://cheerio.js.org/).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Getting Started

Assuming you've cloned the project to your local machine, you'll need to install a few dependencies:

```bash
cd github-issue-tracker/
npm install
```

Once that's out of the way, you can go ahead and start the server:

```bash
npm start
```

Now, the application will be available on [http://localhost:3000](http://localhost:3000/index.html)

## Explanation

- User provides the link on the app. AJAX call is made to the API.
- Obtain the username and repository through the API as parameters.
- Make a request for the issues page of the repository and get the total no. of open issues.
- Filter all the issues' timestamps based on CSS selectors and store them in array.
- Check if the pagination panel exists and the next button is enabled.
- If so, keep making requests for subsequent pages until we have all the issues data.
- Also check if the last issue on the page is older than a week, we can stop making requests in that case.
- Compute the number of issues in different categories based on their recency, for requests older than a week we just have to subract the other two from the total.
- Return the data in JSON object.
- Render the information as a table on app.

## Improvements

Given more time, significant improvements could be made to the:

- Backend API i.e. validation, error handling, scraping more rich data like titles and comments on issues, sentiment analysis on the content.

- UI/UX of the application frontend, making it easier for users to obtain useful information from the site in less time.

Project could also be improved by updating it to use the [GitHub Issues REST API](https://developer.github.com/v3/issues/) directly.
