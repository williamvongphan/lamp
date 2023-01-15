const UserSchema = require('../../../models/User.js');

let route = {
	"name": "login",
	"path": "/login",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 1
	},
	"authentication": {
		"active": false,
	},
	"handler": function (req, res) {
		console.log(req.body);
		// Use passport local strategy to authenticate user
		req.login(req.body, function (err) {
			if (err) {
				console.log(err.stack);
				res.status(401).json({
					"error": "Unauthorized",
					"message": "Invalid username/email or password.",
					"status": 401
				});
				return;
			}
			// If user is authenticated, set a session up for them and return a status
			if (req.isAuthenticated()) {
				// Set session up
				req.session.user = req.user;
				// Return status
				res.status(200).json({
					"message": "Successfully logged in.",
					"status": 200
				});
				return;
			}
		});
	}
}

module.exports = route;