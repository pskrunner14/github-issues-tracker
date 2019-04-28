const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware config
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Set up the routes
app.use(require('./routes'));

// Start the server
const server = app.listen(PORT, () => {
    const HOST = server.address().address === '::' ? "localhost" : server.address().address;
    console.log(`Server listening on http://${HOST}:${PORT}`);
});

// Error Handling
app.use((req, res, next) => {
    res.status(404).send("Oh uh, something went wrong");
});

const shutdown = function (message, err) {
    console.log(`${message}: shutting down...`);
    console.error(err);
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    return shutdown('Uncaught excecption occurred', err);
});