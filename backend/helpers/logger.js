const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const config = require('config');

const debugFormat = format.printf(({ level, message, label }) => {
	const timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
	return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
	format: format.combine(
		format.colorize(),
		debugFormat
	),
	transports: [ new transports.Console({
		silent: !config.logs.debug.enable,
		prettyPrint: JSON.stringify,
	}) ],
});

module.exports = logger;
