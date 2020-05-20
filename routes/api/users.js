const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');

const bcrypt = require('bcryptjs');

const gravatar = require('gravatar');

const User = require('../../models/User');

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
	'/',
	[
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a valid password').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;
		try {
			// Does user exist
			let user = await User.findOne({
				email: email,
			});

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			// Get Gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'PG',
				d: 'mm',
			});

			user = new User({
				name,
				email,
				password,
				avatar,
			});

			// Encrypt Password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			// return jsonwebtoken
			res.send('User registered');
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	},
);

module.exports = router;
