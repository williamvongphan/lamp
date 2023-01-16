const UserSchema = require('../../../models/User.js');
const HistorySchema = require('../../../models/History.js');
let route = {
	"name": "profile",
	"path": "/profile",
	"method": "get",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 1
	},
	"handler": async function (req, res) {
		// If there is a specific user in the request, return their profile
		if (req.query.user) {
			UserSchema.findOne({
				"username": req.query.user
			}, async function (err, user) {
				if (err) {
					console.log(err.stack);
					res.status(500).json({
						"error": "Internal Server Error",
						"message": "An internal server error occurred.",
						"status": 500
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
				// Collect all history items for this user
				let history = await HistorySchema.find({
					"user": user._id
				});

				// Get total number and average score
				let total = 0;
				let average = 0;
				let lastTimestamp = 0;
				for (let i = 0; i < history.length; i++) {
					total++;
					average += history[i].score;
					if (history[i].timestamp > lastTimestamp) {
						lastTimestamp = history[i].timestamp;
					}
				}
				average = average / total;

				// Get last 10 history items for this user
				let last10 = await HistorySchema.find({
					"user": user._id
				}).sort({"timestamp": -1}).limit(10);

				res.status(200).json({
					"message": "Successfully retrieved user profile.",
					"status": 200,
					"username": user.username,
					"bio": user.bio,
					"average": average,
					"total": total,
					"history": last10,
					"lastTimestamp": lastTimestamp
				});
			});
		}
		// If there is no specific user in the request, return the current user's profile (if they are logged in)
		else {
			if (req.isAuthenticated()) {
				UserSchema.findOne({
					"username": req.user.username
				}, async function (err, user) {
					if (err) {
						console.log(err.stack);
						res.status(500).json({
							"error": "Internal Server Error",
							"message": "An internal server error occurred.",
							"status": 500
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
					// Collect all history items for this user
					let history = await HistorySchema.find({
						"user": user._id
					});

					// Get total number and average score
					let total = 0;
					let average = 0;
					let lastTimestamp = 0;
					for (let i = 0; i < history.length; i++) {
						total++;
						average += history[i].score;
						if (history[i].timestamp > lastTimestamp) {
							lastTimestamp = history[i].timestamp;
						}
					}
					average = average / total;

					// Get last 10 history items for this user
					let last10 = await HistorySchema.find({
						"user": user._id
					}).sort({"timestamp": -1}).limit(10);

					res.status(200).json({
						"message": "Successfully retrieved user profile.",
						"status": 200,
						"username": user.username,
						"bio": user.bio,
						"average": average,
						"total": total,
						"history": last10,
						"lastTimestamp": lastTimestamp
					});
				});
			} else {
				res.status(401).json({
					"error": "Unauthorized",
					"message": "You must be logged in to view your profile.",
					"status": 401
				});
			}
		}
	}
}

module.exports = route;