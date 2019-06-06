const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = Schema({
	title: {
		type: String,
		unique: true,
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
},
{
	timestamps: true,
});

function autoPopulateSubs(next) {
	this.populate('parent');
	next();
}

schema
	.pre('findOne', autoPopulateSubs)
	.pre('find', autoPopulateSubs);

module.exports = mongoose.model('Category', schema);
