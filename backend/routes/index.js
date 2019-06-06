const express = require('express');
const app = express();
const category = require('./category');
const recipe = require('./recipe');
const article = require('./article');

// Categories
app.use('/categories', category);

// Recipes
app.use('/recipes', recipe);

// Articles
app.use('/articles', article);

// wrong endpoint
app.use((req, res) => {
	res.code = 400;
	res.error = 'wrong endpoint';
	res.done();
});

// export all routes
module.exports = app;
