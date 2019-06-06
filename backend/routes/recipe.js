const express = require('express');
const app = express();
const recipe = require('controllers/recipe');

// create a new recipe
app.post('/', recipe.create);

// retrieve all recipes
app.get('/', recipe.findAll);

// retrieve a single recipe by id
app.get('/:id', recipe.findById);

// update a recipe by id
app.put('/:id', recipe.update);

// delete a recipe by id
app.delete('/:id', recipe.delete);

module.exports = app;
