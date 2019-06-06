const Category = require('models/category');
const Recipe = require('models/recipe');
const Article = require('models/article');

// create and save a new category
exports.create = async(req, res) => {
	const data = req.body;

	// validate request
	if (typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	// create a Category
	let category = new Category({
		title: data.title,
		parent: null,
	});

	if (data.parentId) {
		let parentId = data.parentId;

		const parent = await Category.findById(parentId)
			.catch(() => {});

		if (!parent) {
			res.code = 400;
			res.error = 'parent category with id ' + parentId + ' not found';
			return res.done();
		} else {
			category.parent = parent;
		}
	}

	// save in the database
	category.save()
		.then(data => {
			res.done(data);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while creating the category';
			res.done();
		});
};

// retrieve and return all categories from the database
exports.findAll = (req, res) => {
	Category.find()
		.then(categories => {
			res.done(categories);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while retrieving categories';
			res.done();
		});
};

// find a single category with by id
exports.findById = (req, res) => {
	let id = req.params.id;

	Category.findById(id)
		.then(category => {
			if (!category) {
				res.code = 400;
				res.error = 'category with id ' + id + ' not found';
				res.done();
			} else {
				res.done(category);
			}
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'category with id ' + id + ' not found';
			} else {
				res.code = 500;
				res.error = 'error retrieving category with id ' + id;
			}

			res.done();
		});
};

// retrieve all recipes by category id
exports.findAllRecipes = async(req, res) => {
	let id = req.params.id;

	try {
		const category = await Category.findById(id);

		if (!category) {
			res.code = 400;
			res.error = 'category with id ' + id + ' not found';
			return res.done();
		}

		const recipes = await Recipe.find({ category: id });

		res.done(recipes);
	} catch (error) {
		res.code = 500;
		res.error = 'some error occurred while retrieving recipes';
	}
};

// retrieve all articles by category id
exports.findAllArticles = async(req, res) => {
	let id = req.params.id;

	try {
		const category = await Category.findById(id);

		if (!category) {
			res.code = 400;
			res.error = 'category with id ' + id + ' not found';
			return res.done();
		}

		const articles = await Article.find({ category: id });

		res.done(articles);
	} catch (error) {
		res.code = 500;
		res.error = 'some error occurred while retrieving articles';
	}
};

// update a category identified by the id in the request
exports.update = async(req, res) => {
	let id = req.params.id;
	let data = req.body;

	// Validate Request
	if (!data.title && !data.parentId) {
		res.code = 400;
		res.error = 'at least one parameter must be specified';
		return res.done();
	}

	if (data.title && typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	// create a Category
	let category = {};

	if (data.title) {
		category.title = data.title;
	}

	if (data.parentId) {
		let parentId = data.parentId;

		const parent = await Category.findById(parentId)
			.catch(() => {});

		if (!parent) {
			res.code = 400;
			res.error = 'parent category with id ' + parentId + ' not found';
			return res.done();
		} else {
			category.parent = parent;
		}
	}

	// find category and update it with the request body
	Category.findByIdAndUpdate(id, category, { new: true })
		.then(category => {
			if (!category) {
				res.code = 400;
				res.error = 'category with id ' + id + ' not found';
				return res.done();
			}

			res.done(category);
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'category with id ' + id + ' not found';
				return res.done();
			}

			res.code = 500;
			res.error = 'error updating category with id ' + id;
			return res.done();
		});
};

// delete a category with the specified id in the request
exports.delete = (req, res) => {
	let id = req.params.id;

	Category.findByIdAndRemove(id)
		.then(category => {
			if (!category) {
				res.code = 404;
				res.error = 'category with id ' + id + ' not found';
				return res.done();
			}

			Category.updateMany({ parent: id }, { $set: { parent: null } });

			res.done('category deleted successfully');
		})
		.catch(error => {
			if (error.kind === 'ObjectId' || error.name === 'NotFound') {
				res.code = 404;
				res.error = 'category with id ' + id + ' not found';
				return res.done();
			}

			res.code = 500;
			res.error = 'error removing category with id ' + id;
			return res.done();
		});
};
