const mongoose = require('mongoose');

const mongoosastic = require('mongoosastic');

const PostSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		required: true,
	},
	// Same as name of User (to keep posts if user deletes account)
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	likes: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users',
			},
		},
	],
	comments: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users',
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

PostSchema.plugin(mongoosastic, {
	host: 'localhost',
	port: 9200,
});

const Post = mongoose.model('post', PostSchema);

Post.createMapping((err, mapping) => {
	console.log('mapping created');
});

module.exports = Post;
