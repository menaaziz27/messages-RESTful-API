const express = require('express');
const router = express.Router();

const { postSignup, postLogin } = require('../controllers/auth');
const { validateSignup } = require('../helpers/validation');

router.route('/signup').post(validateSignup, postSignup);
router.route('/login').post(postLogin);

module.exports = router;
