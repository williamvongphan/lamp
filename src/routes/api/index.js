// Load routes from appropriate folders (can be nested to any depth)
const fs = require('node:fs');
const path = require('node:path');
const utils = require('../../util/index.js');

const loadRoutes = function (app, dir) {
	let pathsToRoutes = utils.search.getRoutes(dir).filter(route => typeof route === 'object' && route.path !== __filename);
	let ratelimits = {};
	for (let i = 0; i < pathsToRoutes.length; i++) {
		let route = pathsToRoutes[i];
		// Add route to express app
		app[route.method]('/api' + route.path, (req, res) => {
			// Implement rate limit natively before request handler
			if (route.ratelimit && route.ratelimit.active) {
				let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				// Window (in ms) and max requests
				let window = route.ratelimit.window;
				let max = route.ratelimit.max;
				// If ratelimit is not set for this IP, set it
				if (!ratelimits[ip]) {
					ratelimits[ip] = {
						"requests": 0,
						"lastRequest": Date.now()
					};
				}
				// If ratelimit is set for this IP, check if it is expired
				if (ratelimits[ip]) {
					// If expired, reset ratelimit
					if (Date.now() - ratelimits[ip].lastRequest > window) {
						ratelimits[ip] = {
							"requests": 0,
							"lastRequest": Date.now()
						};
					}
				}
				// If ratelimit is set for this IP, check if it is exceeded
				if (ratelimits[ip]) {
					// If exceeded, return 429
					if (ratelimits[ip].requests >= max) {
						res.status(429).json({
							"error": "Too many requests",
							"message": "You have exceeded the maximum number of requests allowed in the given time window.",
							"status": 429
						});
						return;
					}
				}
				// If ratelimit is set for this IP, increment requests
				if (ratelimits[ip]) {
					ratelimits[ip].requests++;
				}
			}
			// Implement authentication natively before request handler
			if (route.authentication && route.authentication.active) {
				if (route.authentication.type === 'session') {
					// Check if user is authenticated
					if (!req.isAuthenticated()) {
						res.status(401).json({
							"error": "Unauthorized",
							"message": "You are not authorized to access this resource.",
							"status": 401
						});
					}
				}
			}

			// Call request handler
			route.handler(req, res);
		});
	}
}

module.exports = loadRoutes;