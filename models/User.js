const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	email: {
		type: 'string',
		required: true,
	},
	password: {
		type: 'string',
		required: true,
	},
	name: {
		type: 'string',
		required: true,
	},
	status: {
		type: 'string',
		default: 'I am new',
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
