const UserSchema = require('../../../models/User.js');
const HistorySchema = require('../../../models/History.js');
let route = {
	"name": "history",
	"path": "/history",
	"method": "get",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 5
	},
	"handler": async function (req, res) {
		// Get the history item in the request
		let history = await HistorySchema.findOne({
			"_id": req.query.id
		});
		if (!history) {
			res.status(404).json({
				"error": "Not Found",
				"message": "History item not found.",
				"status": 404
			});
			return;
		}
		// Get the user who owns this history item
		let user = await UserSchema.findOne({
			"_id": history.user
		});
		if (!user) {
			res.status(406).json({
				"error": "Not Acceptable",
				"message": "History item does not have a valid user.",
				"status": 404
			});
			return;
		}
		// Return the history item
		res.status(200).json({
			"message": "Successfully retrieved history item.",
			"status": 200,
			"score": history.score,
			"scores": history.scores,
			"solvedVector": history.solvedVector,
			"submittedVector": history.submittedVector,
			"startingVector": history.startingVector,
			"projectionVector": history.projectionVector,
			"user": user.username,
			"timestamp": Date.now()
		});
	}
}

module.exports = route;