// Mongoose models for User
const mongoose = require('mongoose');
const UserSchema = require('./User.js');

let challengeSchema = new mongoose.Schema({
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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model("Challenge", challengeSchema)