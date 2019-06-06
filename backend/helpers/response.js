const express = require('express');
const app = express();

app.use((req, res) => {
	res.done = (value) => {
		let obj = {
			status: 0,
		};

		let responseCode = res.code || 200;

		if (res.error) {
			let error = res.error;

			obj.status = 1;
			obj.error = error;
		} else if (value) {
			obj.value = value;
		}

		if (responseCode) {
			res.status(responseCode);
		}

		res.json(obj);
	};

	req.next();
});

module.exports = app;
