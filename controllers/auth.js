const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.postSignup = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error('validation error');
			error.statusCode = 422;
			error.data = errors.array();
			throw error;
		}
		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
		const hashedPassword = await bcrypt.hash(password, 8);
		let user = new User({
			email,
			name,
			password: hashedPassword,
		});
		user = await user.save();
		res
			.status(201)
			.json({ message: 'user created successfully', userId: user._id });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
