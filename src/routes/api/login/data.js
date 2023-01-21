const UserSchema = require('../../../models/User.js');
const HistorySchema = require('../../../models/History.js');
const ChallengeSchema = require('../../../models/Challenge.js');

let route = {
	"name": "data",
	"path": "/data",
	"method": "get",
	"ratelimit": {
		"active": true,
		"window": 30000,
		"max": 2
	},
	"handler": async function (req, res) {
		// Handler that returns all user data for a given user (for export)
		if (req.isAuthenticated()) {
			// Get the user
			let user = await UserSchema.findOne({
				"username": req.user.username
			});
			if (!user) {
				res.status(404).json({
					"error": "Not Found",
					"message": "User not found.",
					"status": 404
				});
				return;
			}
			// Get the user's history
			let history = await HistorySchema.find({
				"user": user._id
			});
			// Get the user's challenges
			let challenge = await ChallengeSchema.findOne({
				"user": user._id
			});
			// Return the user's data
			res.status(200).json({
				"message": "Successfully retrieved user data.",
				"status": 200,
				"data": {
					"username": user.username,
					"email": user.email,
					"bio": user.bio,
					"history": history,
					"privateProfile": user.privateProfile,
					"challenges": challenge,
					"timestamp": Date.now()
				}
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