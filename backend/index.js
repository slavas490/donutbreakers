const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');
const routes = require('routes');
const morgan = require('morgan');
const cors = require('cors');
const config = require('config');
const mongodb = require('helpers/mongodb');
const response = require('helpers/response');
const logger = require('helpers/logger');

// setup the access logger
if (config.logs.access.enable) {
	const loggerFileStream = fs.createWriteStream(path.join(__dirname, config.logs.path, 'access.log'), { flags: 'a' });
	app.use(morgan('combined', { stream: loggerFileStream }));
}

// enable cors
app.use(cors({
	credentials: true,
	origin: '*',
}));

// parse requests application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests - application/json
app.use(bodyParser.json());

// use formatted response
app.use(response);

// connect a routes
app.use(routes);

// connecting to the database
mongodb.connect()
	.then(() => {
		logger.info('Successfully connected to the database');

		// creating the server
		return app.listen(8080);
	})
	.then(() => {
		logger.info('Server is listening on port 8080');
	})
	.catch(err => {
		logger.warn('Could not connect to the database', err);
	});

