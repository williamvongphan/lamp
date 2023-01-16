// Password utilities
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const random = require('./random.js');
const saltRounds = 10;

module.exports = {
	salt: function () {
		return bcrypt.genSaltSync(saltRounds);
	},
	hash: function (password) {
		// Generate a salt
		const salt = this.salt();
		// For saltRounds, hash the password
		let hash = bcrypt.hashSync(password, salt);
		return { hash: hash, salt: salt };
	},
	compare: function (password, hash) {
		let res = bcrypt.compareSync(password, hash);
		console.log(res);
		return res;
	}
}