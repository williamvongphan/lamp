const crypto = require('crypto');

module.exports = {
	bytes: function (size) {
		return crypto.randomBytes(size);
	},
	string: function (size) {
		let string = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
		for (let i = 0; i < size; i++) {
			string += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return string;
	}
}