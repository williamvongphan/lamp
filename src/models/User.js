// Mongoose models for User
const mongoose = require('mongoose');

let user = new mongoose.Schema({
	username: String,
	email: String,
	passwordHash: String,
	passwordSalt: String,
	bio: String,
});

module.exports = mongoose.model("User", user)