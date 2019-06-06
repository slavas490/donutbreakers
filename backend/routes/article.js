const express = require('express');
const app = express();
const article = require('controllers/article');

// create a new article
app.post('/', article.create);

// retrieve all articles
app.get('/', article.findAll);

// retrieve a single article by id
app.get('/:id', article.findById);

// update a article by id
app.put('/:id', article.update);

// delete a article by id
app.delete('/:id', article.delete);

module.exports = app;
