const UserSchema = require('../../../models/User.js');
const util = require('../../../util/index.js');
let route = {
	"name": "login",
	"path": "/login",
	"method": "post",
	"ratelimit": {
		"active": true,
		"window": 1000,
		"max": 3
	},
	"authentication": {
		"active": false,
	},
	"handler": function (req, res) {
		// If the user is already logged in, redirect them to the home page
		if (req.isAuthenticated()) {
			res.redirect('/');
			return;
		}
		// If the user is not logged in, check if they are trying to log in
		if (req.body.username && req.body.password) {
			// Check if the user exists
			UserSchema.findOne({
				"username": req.body.username
			}).then(function (user) {
				if (!user) {
					res.status(404).json({
						"error": "Not Found",
						"message": "User not found.",
						"status": 404
					});
					return;
				}
				// Check if the password is correct
				if (util.password.compare(req.body.password, user.passwordHash)) {
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
							// Return status
							res.status(200).json({
								"message": "Successfully logged in.",
								"status": 200
							});
							return;
						}
					});
				} else {
					res.status(401).json({
						"error": "Unauthorized",
						"message": "Invalid username/email or password.",
						"status": 401
					});
					return;
				}
			}).catch(function (err) {
				console.log(err.stack);
				res.status(500).json({
					"error": "Internal Server Error",
					"message": "An internal server error occurred.",
					"status": 500
				});
				return;
			});
		}
	}
}

module.exports = route;