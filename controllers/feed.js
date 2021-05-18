const { clear } = require('console');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = (req, res, next) => {
	Post.find({})
		.then(posts => {
			res.status(200).json({
				posts: posts,
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		let error = new Error('validation error');
		error.statusCode = 422;
		throw error;
	}
	if (!req.file) {
		const error = new Error('No Image provided');
		error.statusCode = 422;
		throw error;
	}
	const imageUrl = req.file.path.replace('\\', '/');
	const title = req.body.title;
	const content = req.body.content;
	let creator;
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	});
	post
		.save()
		.then(result => {
			return User.findById(req.userId);
		})
		.then(user => {
			creator = user;
			user.posts.push(post);
			return user.save();
		})
		.then(user => {
			res.status(201).json({
				message: 'Post created successfully',
				post: post,
				creator: {
					_id: creator._id,
					name: creator.name,
				},
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.getPost = (req, res, next) => {
	const postId = req.params.id;
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('Post not found');
				error.statusCode = 404;
				throw error;
			}

			res.status(200).json({ message: 'fetched post.', post: post });
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updatePost = (req, res, next) => {
	const postId = req.params.id;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('validation error');
		error.statusCode = 422;
		throw error;
	}
	const title = req.body.title;
	const content = req.body.content;
	const imageUrl = req.body.image;
	if (req.file) {
		// for windows os users
		imageUrl = req.file.path.replace('\\', '/');
	}
	if (!imageUrl) {
		const error = new Error('No image picked');
		error.statusCode = 422;
		throw error;
	}

	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('no post found');
				error.statusCode = 404;
				throw error;
			}

			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not Authorized');
				error.statusCode = 403;
				throw error;
			}
			// if the user updated the image clear the previous one
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}
			post.title = title;
			post.content = content;
			post.imageUrl = imageUrl;
			return post.save();
		})
		.then(post => res.status(200).json({ post }))
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deletePost = (req, res, next) => {
	const postId = req.params.id;
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('no post found');
				error.statusCode = 404;
				throw error;
			}
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not Authorized');
				error.statusCode = 403;
				throw error;
			}
			if (post.imageUrl) {
				clearImage(post.imageUrl);
			}
			return Post.findByIdAndDelete(postId);
		})
		.then(result => {
			return User.findById(req.userId);
		})
		.then(user => {
			user.posts.pull(postId);
			return user.save();
		})
		.then(result => {
			res.json({ message: 'post is deleted' });
		})
		.catch();
};

const clearImage = filePath => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, err => {
		console.log(err);
	});
};
