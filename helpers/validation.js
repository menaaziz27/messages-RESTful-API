const { body } = require('express-validator');
const User = require('../models/User');

exports.validateSignup = [
	body('email')
		.exists()
		.isEmail()
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject('Email is already taken');
				}
			});
		})
		.normalizeEmail(),
	body('password').not().isEmpty().isLength({ min: 5 }),
];

exports.postValidate = [
	body('title').trim().isLength({ min: 5 }),
	body('content').trim().isLength({ min: 5 }),
];
