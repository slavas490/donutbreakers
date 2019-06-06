const mongoose = require('mongoose');
const config = require('config');

// configuring the database
mongoose.Promise = global.Promise;

module.exports = {
	connect: () => {
		return mongoose.connect(config.database.url, { useNewUrlParser: true });
	},
};
