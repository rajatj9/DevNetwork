const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const request = require('request');
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

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
	try {
		// @todo remove the user's posts
		// First remove the profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Then remove user
		await User.findOneAndRemove({ _id: req.user.id });
		res.json({ msg: 'User removed successfully!' });
	} catch (error) {
		console.log(err.message);
		res.status(500).send('Server error!');
	}
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title required.')
				.not()
				.isEmpty(),
			check('company', 'Company is required')
				.not()
				.isEmpty(),
			check('from', 'Starting Date is required')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty) {
				return res.status(400).json({ errors: errors.array() });
			}
			const {
				title,
				company,
				from,
				to,
				location,
				current,
				description,
			} = req.body;

			const exp = {
				title,
				company,
				from,
				to,
				location,
				current,
				description,
			};

			try {
				const profile = await Profile.findOne({ user: req.user.id });
				profile.experience.unshift(exp);
				await profile.save();
				res.json(profile);
			} catch (err) {
				console.log(err.message);
				res.status(500).send('Server Error!');
			}
		} catch (error) {
			console.log(err.message);
			res.status(500).send('Server error!');
		}
	},
);

// @route  DELETE api/profile/experience
// @desc   Delete experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// Find index of experience to be removed
		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (error) {
		console.log(err.message);
		res.status(500).send('Server error!');
	}
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required')
				.not()
				.isEmpty(),
			check('degree', 'Degree is required')
				.not()
				.isEmpty(),
			check('fieldofstudy', 'Field of study is required')
				.not()
				.isEmpty(),
			check('from', 'From date is required and needs to be from the past')
				.not()
				.isEmpty()
				.custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	},
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id });
		foundProfile.education = foundProfile.education.filter(
			edu => edu._id.toString() !== req.params.edu_id,
		);
		await foundProfile.save();
		return res.status(200).json(foundProfile);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public

router.get('/github/:username', async (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId',
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);

			if (response.statusCode != 200) {
				return res.status(500).json({ msg: 'No github profile found.' });
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
