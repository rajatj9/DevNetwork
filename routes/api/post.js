const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');
const search = require('../../es/search');

// @route  POST api/post
// @desc   Add new post
// @access Private
router.post(
	'/',
	[auth, [check('text', 'Post cannot be empty').not().isEmpty()]],
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
			console.log(err.message);
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
		console.log(err.message);
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
		console.log(err.message);

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

// @route PUT /api/post/like/:id
// @desc  like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		if (post.likes.some((like) => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();

		return res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route PUT /api/post/unlike/:id
// @desc  unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post not liked yet' });
		}

		// Get remove index
		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);
		await post.save();

		return res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route  POST api/post/comment/:id
// @desc   Add new comment on post
// @access Private
router.post(
	'/comment/:id',
	[auth, [check('text', 'Post cannot be empty').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		try {
			const post = await Post.findById(req.params.id);
			const user = await User.findById(req.user.id).select('-password');
			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};
			post.comments.unshift(newComment);
			await post.save();
			res.json(post.comments);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error!');
		}
	},
);

// @route DELETE /api/post/comment/:id/:comment_id
// @desc  Delete comment
// @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Retrieve comment

		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id,
		);

		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exist' });
		}

		if (comment.user.id.toString() == req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);

		await post.save();
		res.json(post.comments);
	} catch (error) {
		console.log(error);

		if (error.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found.' });
		}

		res.status(500).send('Server Error!');
	}
});

router.get('/find/:query', auth, async (req, res) => {
	try {
		const body = {
			query: {
				match: {
					text: req.params.query,
				},
			},
		};

		esResponse = await search('posts', '_doc', body);
		res.json(esResponse.hits);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error!');
	}
});

module.exports = router;
