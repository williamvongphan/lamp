// Load routes from appropriate folders (can be nested to any depth)
const fs = require('fs');
const path = require('path');
const utils = require('../../util/index.js');

// These are API routes so make sure to prefix them with /api

const loadRoutes = function (app, dir) {
	let pathsToRoutes = utils.search.getRoutes(dir).filter(route => route.path !== __filename);
	for (let i = 0; i < pathsToRoutes.length; i++) {
		let route = pathsToRoutes[i];

		if (route.method === 'get') {
			app.get(route.path, (req, res) => {
				if (route.authentication && route.authentication.active) {
					if (route.authentication.type === 'session') {
						// Check if user is authenticated
						if (!req.isAuthenticated()) {
							res.status(401).render('401', {
								// Get path (not anything before https://site.tld/) the user was trying to access
								"url": route.path
							});
						}
					}
				}

				// Route handler
				route.handler(req, res);
			});
		} else if (route.method === 'post') {
			app.post(route.path, (req, res) => {
				if (route.authentication && route.authentication.active) {
					if (route.authentication.type === 'session') {
						// Check if user is authenticated
						if (!req.isAuthenticated()) {
							res.status(401).render('401', {
								// Get path (not anything before https://site.tld/) the user was trying to access
								"url": route.path
							});
						}
					}
				}

				// Route handler
				route.handler(req, res);
			});
		}
	}

	// 404 handler
	app.use((req, res) => {
		res.status(404).render('404', {
			// Get path (not anything before https://site.tld/) the user was trying to access
			"url": req.path
		});
	});
}

module.exports = loadRoutes;