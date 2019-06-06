const express = require('express');
const app = express();
const category = require('controllers/category');

// create a new category
app.post('/', category.create);

// retrieve all categories
app.get('/', category.findAll);

// retrieve a single category by id
app.get('/:id', category.findById);

// retrieve all recipes by category id
app.get('/:id/recipes', category.findAllRecipes);

// retrieve all articles by category id
app.get('/:id/articles', category.findAllArticles);

// update a category by id
app.put('/:id', category.update);

// delete a category by id
app.delete('/:id', category.delete);

module.exports = app;
