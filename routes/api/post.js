const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');

// @route  POST api/post
// @desc   Add new post
// @access Private
router.post(
	'/',
	[
		auth,
		[
			check('text', 'Post cannot be empty')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const newPost = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			const post = new Post(newPost);
			await post.save();
			res.json(post);
		} catch (err) {
			console.log(err);
			res.status(500).send('Server Error!');
		}
	},
);

// @route GET /api/post/
// @desc  Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error!');
	}
});

// @route GET /api/post/:id
// @desc  Get post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: 'Post not found.' });
		}
		res.json(post);
	} catch (err) {
		console.log(err);

		if (err.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found.' });
		}

		res.status(500).send('Server Error!');
	}
});

// @route DELETE /api/post/:id
// @desc  Delete a post
// @access Private

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Only user who owns the post can delete the post
		if (post.user.toString() != req.user.id) {
			return res
				.status(401)
				.json({ msg: 'User not authorized to delete this post.' });
		}
		await post.remove();
		res.json({ msg: 'Post removed!' });
	} catch (error) {
		console.log(error);

		if (error.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found.' });
		}

		res.status(500).send('Server Error!');
	}
});

module.exports = router;
