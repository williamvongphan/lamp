const UserSchema = require('../../../models/User.js');
const ChallengeSchema = require('../../../models/Challenge.js');
const utils = require('../../../util/index.js');

let route = {
	"name": "challenge", 
	"path": "/challenge", 
	"method": "get",
	"ratelimit": {
		"active": true, 
		"window": 1000, 
		"max": 10
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
			// Generate a new challenge
			let challenge = utils.game.generateChallenge();
			// Update the challenge in the database if it exists for the user
			if (await ChallengeSchema.exists({user: user._id})) {
				await ChallengeSchema.updateOne({
					"user": user._id
				}, {
					"startingVector": challenge.startingVector,
					"projectionVector": challenge.projectionVector,
					"solvedVector": challenge.solvedVector
				});
			} else {
				// Create a new challenge for the user
				let newChallenge = new ChallengeSchema({
					"user": user._id,
					"startingVector": challenge.startingVector,
					"projectionVector": challenge.projectionVector,
					"solvedVector": challenge.solvedVector
				});
				// Save the challenge
				await newChallenge.save();
			}
			// Return challenge
			res.status(200).json({
				"message": "Successfully generated challenge.",
				"status": 200,
				"data": {
					"startingVector": challenge.startingVector,
					"projectionVector": challenge.projectionVector
				}
			});
		} else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You need to log in to get a challenge.",
				"status": 401
			});
			return;
		}
	}
}

module.exports = route;