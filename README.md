# GitHub Issues Tracker

[![Demo on Heroku](./images/demo.svg)](https://github-issues-tracker.herokuapp.com/) [![Hackage-Deps](https://img.shields.io/hackage-deps/v/lens.svg)](https://github.com/pskrunner14/github-issues-tracker/network/dependencies)

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