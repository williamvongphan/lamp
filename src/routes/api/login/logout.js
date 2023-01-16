const UserSchema = require('../../../models/User.js');

let route = {
	"name": "logout",
	"path": "/logout",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 3
	},
	"handler": function (req, res) {
		// If user is authenticated, destroy their session and return a status
		if (req.isAuthenticated()) {
			// Destroy session
			req.session.destroy();
			// Return status
			res.status(200).json({
				"message": "Successfully logged out.",
				"status": 200
			});
			return;
		}
		// If user is not authenticated, return a status
		else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "You are not logged in.",
				"status": 401
			});
			return;
		}
	}
}

module.exports = route;