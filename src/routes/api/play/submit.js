const UserSchema = require('../../../models/User.js');
const ChallengeSchema = require('../../../models/Challenge.js');
const HistorySchema = require('../../../models/History.js');
const utils = require('../../../util/index.js');

let route = {
	"name": "submit",
	"path": "/submit",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 5
	},
	"authentication": {
		"active": false,
	},
	"handler": async function (req, res) {
		// Check if user is authenticated
		if (req.isAuthenticated()) {
			// Unserialize user from passport
			let user = req.user;
			// Check if user has a challenge
			let challenge = await ChallengeSchema.findOne({
				"user": user._id
			});
			// Compare the challenge's solved vector with the submitted vector
			let {score, scores} = utils.game.score(challenge.solvedVector, req.body.vector);
			// Update the user's score and scores by creating a history entry
			let history = new HistorySchema({
				"user": user._id,
				"score": score,
				"scores": scores,
				"solvedVector": challenge.solvedVector,
				"submittedVector": req.body.vector,
				"startingVector": challenge.startingVector,
				"projectionVector": challenge.projectionVector,
				"timestamp": Date.now()
			});
			// Save the history entry
			await history.save();
			// Update the user's score and scores
			// Give the score to the user
			res.status(200).json({
				"message": "Successfully submitted vector.",
				"status": 200,
				"score": score,
				"scores": scores,
				"solvedVector": challenge.solvedVector,
				"submittedVector": req.body.vector,
				"startingVector": challenge.startingVector,
				"projectionVector": challenge.projectionVector,
				"timestamp": Date.now()
			});
		} else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You need to log in to submit a vector.",
				"status": 401
			});
			return;
		}
	}
}

module.exports = route;