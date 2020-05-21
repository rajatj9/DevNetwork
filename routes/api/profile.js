const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route  GET api/profile/me
// @desc   Get profile of current user
// @access Private
router.get('/me', auth, async (req, res) => {
	try {
		// Find profile by user id
		// add Name and avatar to profile which come from user model using populate
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar'],
		);

		if (!profile) {
			return res.status(400).json({ msg: 'Profile does not exist' });
		}

		res.json(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

// @route  POST api/profile/
// @desc   Create/update user profile
// @access Private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required')
				.not()
				.isEmpty(),
			check('skills', 'Skill is required')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			location,
			website,
			bio,
			skills,
			status,
			githubusername,
			youtube,
			twitter,
			instagram,
			linkedin,
			facebook,
		} = req.body;

		// Building profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		profileFields.status = status;
		if (company) profileFields.company = company;
		if (location) profileFields.location = location;
		if (website) profileFields.website = website;
		if (bio) profileFields.bio = bio;
		if (githubusername) profileFields.githubusername = githubusername;
		profileFields.skills = skills.split(',').map(skill => skill.trim());

		// Build social object
		profileFields.social = {};
		if (twitter) profileFields.social.twitter = twitter;
		if (youtube) profileFields.social.youtube = youtube;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			// If profile found then update it
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true },
				);
				return res.json(profile);
			}

			// else create it
			profile = new Profile(profileFields);
			await profile.save();

			res.json(profile);
		} catch (err) {
			console.log(err);
			res.status(500).send('Profile creation failed.');
		}
	},
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (error) {
		console.log(err.message);
		res.statys(500).send('Server error!');
	}
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by userID
// @access Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);
		if (!profile) {
			return res.status(400).json({ msg: 'Profile does not exist!' });
		}
		res.json(profile);
	} catch (error) {
		console.log(err.message);
		// if user_ID is invalid,
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile does not exist!' });
		}
		res.statys(500).send('Server error!');
	}
});

module.exports = router;
