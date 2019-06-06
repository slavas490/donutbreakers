const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = Schema({
	title: String,
	description: String,
	text: String,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
},
{
	timestamps: true,
});

function autoPopulateSubs(next) {
	this.populate('category');
	next();
}

schema
	.pre('findOne', autoPopulateSubs)
	.pre('find', autoPopulateSubs);

module.exports = mongoose.model('Article', schema);
