// Mongoose models for User
const mongoose = require('mongoose');
const UserSchema = require('./User.js');
const ChallengeSchema = require('./Challenge.js');

let historySchema = new mongoose.Schema({
	startingVector: {
		type: Array,
		required: true
	},
	projectionVector: {
		type: Array,
		required: true
	},
	solvedVector: {
		type: Array,
		required: true
	},
	submittedVector: {
		type: Array,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	score: {
		type: Number,
		required: true
	},
	scores: {
		type: Array,
		required: true
	},
	timestamp: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("History", historySchema);