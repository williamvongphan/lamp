const UserSchema = require('../../../models/User.js');
const utils = require('../../../util/index.js');
let route = {
	"name": "password",
	"path": "/settings/password",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 1
	},
	"handler": async function (req, res) {
		// You must be logged in to change your password
		if (req.isAuthenticated()) {
			// Get the user
			let user = await UserSchema.findOne({
				"_id": req.user._id
			});
			if (!user) {
				res.status(404).json({
					"error": "Not Found",
					"message": "User not found.",
					"status": 404
				});
				return;
			}
			// Check if the old password is correct
			if (utils.password.compare(req.body.oldPassword, user.passwordHash)) {
				// Update the user but if new password isn't >= 6 characters, return an error
				if (!req.body.newPassword.length >= 6) {
					res.status(406).json({
						"error": "Not Acceptable",
						"message": "New password must be at least 6 characters.",
						"status": 406
					});
					return;
				}
				let { hash, salt } = utils.password.hash(req.body.newPassword);
				user.passwordHash = hash;
				user.passwordSalt = salt;
				await user.save();
				// Return the user
				res.status(200).json({
					"message": "Successfully updated password.",
					"status": 200
				});
			} else {
				res.status(401).json({
					"error": "Unauthorized",
					"message": "The old password is incorrect.",
					"status": 401
				});
			}
		} else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You must be logged in to change your password.",
				"status": 401
			});
		}
	}
}

module.exports = route;