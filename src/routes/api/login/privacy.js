const UserSchema = require('../../../models/User.js');

let route = {
	"name": "privacy",
	"path": "/settings/privacy",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 5
	},
	"handler": async function (req, res) {
		// You must be logged in to change your bio
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
			console.log(req.body)
			// Update the user
			user.privateProfile = req.body.privateProfile;
			await user.save();
			// Return the user's data
			res.status(200).json({
				"message": "Successfully updated user privacy settings.",
				"status": 200,
			});
		} else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You must be logged in to change your bio.",
				"status": 401
			});
		}
	}
}

module.exports = route;