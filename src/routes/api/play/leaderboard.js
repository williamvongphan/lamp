const HistorySchema = require('../../../models/History.js');
const UserSchema = require('../../../models/User.js');
const utils = require('../../../util/index.js');

let route = {
	"name": "leaderboard",
	"path": "/leaderboard",
	"method": "get",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 1
	},
	"authentication": {
		"active": false,
	},
	"handler": async function (req, res) {
		let topTenHistoriesByScore = await HistorySchema.find().sort({score: -1}).limit(10);
		let topTenHistoriesArray = [];
		// For each score, get the user's username and replace the user id with the username
		for (let i = 0; i < topTenHistoriesByScore.length; i++) {
			let history = topTenHistoriesByScore[i];
			let user = await UserSchema.findById(history.user);
			topTenHistoriesArray.push({
				"score": history.score,
				"user": user.username,
			});
		}
		let topTenHistoriesByTimestamp = await HistorySchema.find().sort({timestamp: -1}).limit(10);
		let topTenHistoriesByTimestampArray = [];
		// For each score, get the user's username and replace the user id with the username
		for (let i = 0; i < topTenHistoriesByTimestamp.length; i++) {
			let history = topTenHistoriesByTimestamp[i];
			let user = await UserSchema.findById(history.user);
			topTenHistoriesByTimestampArray.push({
				"timestamp": history.timestamp,
				"user": user.username,
			});
		}
		// Count number of history entries per user, and get the top 10
		let topTenHistoriesByCount = await HistorySchema.aggregate([
			{
				$group: {
					_id: "$user",
					count: { $sum: 1 }
				}
			}
		]).sort({count: -1}).limit(10);
		let topTenHistoriesByCountArray = [];
		// For each count, get the user's username and replace the user id with the username
		for (let i = 0; i < topTenHistoriesByCount.length; i++) {
			let history = topTenHistoriesByCount[i];
			let user = await UserSchema.findById(history._id);
			topTenHistoriesByCountArray.push({
				"count": history.count,
				"user": user.username,
			});
		}
		// Get the top ten users by number of histories
		res.status(200).json({
			"message": "Successfully retrieved history.",
			"status": 200,
			"score": topTenHistoriesArray,
			"time": topTenHistoriesByTimestampArray,
			"users": topTenHistoriesByCountArray
		});
	}
}

module.exports = route;