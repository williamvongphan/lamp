const UserSchema = require('../../../models/User.js');
const utils = require('../../../util/index.js');

let route = {
	"name": "register", "path": "/register", "method": "post", "ratelimit": {
		"active": true, "window": 1000, "max": 1
	}, "authentication": {
		"active": false,
	}, "handler": async function (req, res) {
		// Create a new user object if the user does not exist and constraints are met (username >=3 characters, password >=6 characters)
		if (req.body.username && req.body.password && req.body.username.length > 2 && req.body.password.length > 5) {
			// Check if user exists
			let user = await UserSchema.findOne({
				"username": req.body.username
			});
			// If user does not exist, create a new user
			if (!user) {
				// Hash the password
				let { hash, salt } = utils.password.hash(req.body.password);
				let newUser = new UserSchema({
					"username": req.body.username,
					"email": req.body.email || null,
					"passwordHash": hash,
					"passwordSalt": salt,
				});
				// Save the new user to the database
				newUser.save(function (err) {
					if (err) {
						res.status(500).json({
							"error": "Internal Server Error",
							"message": "An internal server error has occurred, please try again later.",
							"status": 500
						});
						return;
					}
					// If user is created, set a session up for them and return a status
					if (newUser) {
						// Set session up
						req.session.user = newUser;
						// Return status
						res.status(200).json({
							"message": "Successfully registered.",
							"status": 200
						});
						return;
					}
				});
			}
			// If user exists, return a status
			else {
				res.status(401).json({
					"error": "Unauthorized",
					"message": "This username is taken, please try another.",
					"status": 401
				});
				return;
			}
		}
		// If constraints are not met, return a status
		else {
			res.status(401).json({
				"error": "Unauthorized",
				"message": "Username must be at least 3 characters and password must be at least 6 characters.",
				"status": 401
			});
			return;
		}
	}
}

module.exports = route;