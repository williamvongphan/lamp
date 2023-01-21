const UserSchema = require('../../../models/User.js');
const HistorySchema = require('../../../models/History.js');
const ChallengeSchema = require('../../../models/Challenge.js');
const utils = require('../../../util/index');
let route = {
	"name": "delete",
	"path": "/delete",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 5000,
		"max": 3
	},
	"handler": async function (req, res) {
		// Handler that deletes a user's account and all associated data
		if (req.isAuthenticated()) {
			// Get the user
			let user = await UserSchema.findOne({
				"username": req.user.username
			});
			// Password check
			if (!utils.password.compare(req.body.password, user.passwordHash)) {
				res.status(401).json({
					"error": "Unauthorized",
					"message": "Incorrect password.",
					"status": 401
				});
				return;
			}
			if (!user) {
				res.status(404).json({
					"error": "Not Found",
					"message": "User not found.",
					"status": 404
				});
				return;
			}
			let userId = user._id;
			// Delete the user's history
			await HistorySchema.deleteMany({
				"user": userId
			});
			// Delete the user's challenges
			await ChallengeSchema.deleteMany({
				"user": userId
			});
			// Delete the user
			await UserSchema.deleteOne({
				"_id": userId
			});
			// Destroy the session
			req.session.destroy();
			// Return the user's data
			res.status(200).json({
				"message": "Successfully deleted user account.",
				"status": 200
			});
		} else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You must be logged in to access this resource.",
				"status": 401
			});
		}
	}
}

module.exports = route;