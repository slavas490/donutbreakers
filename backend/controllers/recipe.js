const Recipe = require('models/recipe');
const Category = require('models/category');

// create and save a new recipe
exports.create = async(req, res) => {
	const data = req.body;

	// validate request
	if (typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	if (typeof data.text !== 'string') {
		res.code = 400;
		res.error = '"text" must be a string';
		return res.done();
	}

	if (typeof data.imageURL !== 'string') {
		res.code = 400;
		res.error = '"imageURL" must be a string';
		return res.done();
	}

	if (!data.category) {
		res.code = 400;
		res.error = '"category" is undefined';
		return res.done();
	}

	let categoryId = data.category;

	const category = await Category.findById(categoryId)
		.catch(() => {});

	if (!category) {
		res.code = 400;
		res.error = 'category with id ' + categoryId + ' not found';
		return res.done();
	}

	// create a Recipe
	let recipe = new Recipe({
		title: data.title,
		text: data.text,
		imageURL: data.imageURL,
		category,
	});

	// save in the database
	recipe.save()
		.then(data => {
			res.done(data);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while creating the recipe';
			res.done();
		});
};

// retrieve and return all recipes from the database.
exports.findAll = (req, res) => {
	let limitOption = {};
	let queryOption = {
		skip: +req.query.skip,
		limit: +req.query.limit,
	};

	if (queryOption.skip > 0) {
		limitOption.skip = queryOption.skip;
	}

	if (queryOption.limit > 0) {
		limitOption.limit = queryOption.limit;
	}

	Recipe.find({}, null, limitOption)
		.then(recipes => {
			res.done(recipes);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while retrieving recipes';
			res.done();
		});
};

// find a single recipe with by id
exports.findById = (req, res) => {
	let id = req.params.id;

	Recipe.findById(id)
		.then(recipe => {
			if (!recipe) {
				res.code = 400;
				res.error = 'recipe with id ' + id + ' not found';
				res.done();
			} else {
				res.done(recipe);
			}
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'recipe with id ' + id + ' not found';
			} else {
				res.code = 500;
				res.error = 'error retrieving recipe with id ' + id;
			}

			res.done();
		});
};

// update a recipe identified by the id in the request
exports.update = async(req, res) => {
	const id = req.params.id;
	const data = req.body;
	const categoryId = data.category;

	// Validate Request
	if (!data.title && !data.text && !data.imageURL && !data.category) {
		res.code = 400;
		res.error = 'at least one parameter must be specified';
		return res.done();
	}

	if (data.title && typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	if (data.imageURL && typeof data.imageURL !== 'string') {
		res.code = 400;
		res.error = '"imageURL" must be a string';
		return res.done();
	}

	if (data.text && typeof data.text !== 'string') {
		res.code = 400;
		res.error = '"text" must be a string';
		return res.done();
	}

	let category = null;

	if (categoryId) {
		category = category = await Category.findById(categoryId)
			.catch(() => {});

		if (!category) {
			res.code = 400;
			res.error = 'category with id ' + categoryId + ' not found';
			return res.done();
		}
	}

	// find recipe and update it with the request body
	Recipe.findById(id)
		.then(recipe => {
			if (!recipe) {
				res.code = 400;
				res.error = 'recipe with id ' + id + ' not found';
				res.done();
			} else {
				if (data.title) {
					recipe.title = data.title;
				}

				if (data.text) {
					recipe.text = data.text;
				}

				if (data.imageURL) {
					recipe.imageURL = data.imageURL;
				}

				if (category) {
					recipe.category = category;
				}

				return recipe.save();
			}
		})
		.then(recipe => {
			res.done(recipe);
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'recipe with id ' + id + ' not found';
			} else {
				res.code = 500;
				res.error = 'error retrieving recipe with id ' + id;
			}

			res.done();
		});
};

// delete a recipe with the specified id in the request
exports.delete = (req, res) => {
	let id = req.params.id;

	Recipe.findByIdAndRemove(id)
		.then(recipe => {
			if (!recipe) {
				res.code = 404;
				res.error = 'recipe with id ' + id + ' not found';
				return res.done();
			}

			res.done('recipe deleted successfully');
		})
		.catch(error => {
			if (error.kind === 'ObjectId' || error.name === 'NotFound') {
				res.code = 404;
				res.error = 'recipe with id ' + id + ' not found';
				return res.done();
			}

			res.code = 500;
			res.error = 'error removing recipe with id ' + id;
			return res.done();
		});
};
