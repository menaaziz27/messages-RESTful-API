const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/User');

const { postSignup } = require('../controllers/auth');

const validateSignup = [
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

router.route('/signup').post(validateSignup, postSignup);

module.exports = router;
