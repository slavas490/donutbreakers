const Article = require('models/article');
const Category = require('models/category');

// create and save a new article
exports.create = async(req, res) => {
	const data = req.body;

	// validate request
	if (typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	if (typeof data.description !== 'string') {
		res.code = 400;
		res.error = '"description" must be a string';
		return res.done();
	}

	if (typeof data.text !== 'string') {
		res.code = 400;
		res.error = '"text" must be a string';
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

	// create an article
	let article = new Article({
		title: data.title,
		description: data.description,
		text: data.text,
		category,
	});

	// save in the database
	article.save()
		.then(data => {
			res.done(data);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while creating the article';
			res.done();
		});
};

// retrieve and return all articles from the database.
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

	Article.find({}, null, limitOption)
		.then(articles => {
			res.done(articles);
		})
		.catch(error => {
			res.code = 500;
			res.error = error.message || 'some error occurred while retrieving articles';
			res.done();
		});
};

// find a single article with by id
exports.findById = (req, res) => {
	let id = req.params.id;

	Article.findById(id)
		.then(article => {
			if (!article) {
				res.code = 400;
				res.error = 'article with id ' + id + ' not found';
				res.done();
			} else {
				res.done(article);
			}
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'article with id ' + id + ' not found';
			} else {
				res.code = 500;
				res.error = 'error retrieving article with id ' + id;
			}

			res.done();
		});
};

// update a article identified by the id in the request
exports.update = async(req, res) => {
	const id = req.params.id;
	const data = req.body;
	const categoryId = data.category;

	// Validate Request
	if (!data.title && !data.description && !data.text && !data.category) {
		res.code = 400;
		res.error = 'at least one parameter must be specified';
		return res.done();
	}

	if (data.title && typeof data.title !== 'string') {
		res.code = 400;
		res.error = '"title" must be a string';
		return res.done();
	}

	if (data.description && typeof data.description !== 'string') {
		res.code = 400;
		res.error = '"description" must be a string';
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

	// find article and update it with the request body
	Article.findById(id)
		.then(article => {
			if (!article) {
				res.code = 400;
				res.error = 'article with id ' + id + ' not found';
				res.done();
			} else {
				if (data.title) {
					article.title = data.title;
				}

				if (data.text) {
					article.text = data.text;
				}

				if (category) {
					article.category = category;
				}

				return article.save();
			}
		})
		.then(article => {
			res.done(article);
		})
		.catch(error => {
			if (error.kind === 'ObjectId') {
				res.code = 404;
				res.error = 'article with id ' + id + ' not found';
			} else {
				res.code = 500;
				res.error = 'error retrieving article with id ' + id;
			}

			res.done();
		});
};

// delete a article with the specified id in the request
exports.delete = (req, res) => {
	let id = req.params.id;

	Article.findByIdAndRemove(id)
		.then(article => {
			if (!article) {
				res.code = 404;
				res.error = 'article with id ' + id + ' not found';
				return res.done();
			}

			res.done('article deleted successfully');
		})
		.catch(error => {
			if (error.kind === 'ObjectId' || error.name === 'NotFound') {
				res.code = 404;
				res.error = 'article with id ' + id + ' not found';
				return res.done();
			}

			res.code = 500;
			res.error = 'error removing article with id ' + id;
			return res.done();
		});
};
