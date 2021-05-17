const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
	getPosts,
	createPost,
	getPost,
	updatePost,
	deletePost,
} = require('../controllers/feed');

const postValidate = [
	body('title').trim().isLength({ min: 5 }),
	body('content').trim().isLength({ min: 5 }),
];

router.route('/posts').get(getPosts).post(postValidate, createPost);
router
	.route('/posts/:id')
	.get(getPost)
	.put(postValidate, updatePost)
	.delete(deletePost);

module.exports = router;
