const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				const error = new Error('Email is not registereed yet');
				error.statusCode = 401;
				throw error;
			}
			loadedUser = user;
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (!isMatch) {
					const error = new Error('password does not match');
					error.statusCode = 422;
					throw error;
				}
				const token = jwt.sign(
					{ userId: loadedUser._id.toString() },
					'thisissupersecretsecret',
					{ expiresIn: '1h' }
				);

				res.json({ token, userId: loadedUser._id.toString() });
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				error.statusCode = 500;
			}
			next(err);
		});
};
