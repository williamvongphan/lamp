const UserSchema = require('../../../models/User.js');

let route = {
	"name": "profile",
	"path": "/profile/:username",
	"method": "get",
	"handler": async function (req, res) {
		let user = await UserSchema.findOne({ username: req.params.username })
		if (user && !user.privateProfile) {
			res.render('profile', {
				"username": req.params.username,
				"privacy": false,
			});
		} else {
			res.render('profile404', {
				"username": req.params.username
			});
		}
	}
}

module.exports = route;