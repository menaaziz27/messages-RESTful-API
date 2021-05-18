const express = require('express');
const router = express.Router();
const { postValidate } = require('../helpers/validation');

const {
	getPosts,
	createPost,
	getPost,
	updatePost,
	deletePost,
} = require('../controllers/feed');

const isAuth = require('../middleware/isAuth');

router
	.route('/posts')
	.get(isAuth, getPosts)
	.post(isAuth, postValidate, createPost);
router
	.route('/posts/:id')
	.get(isAuth, getPost)
	.put(isAuth, postValidate, updatePost)
	.delete(isAuth, deletePost);

module.exports = router;
