let route = {
	"name": "home",
	"path": "/",
	"method": "get",
	"handler": function (req, res) {
		if (req.isAuthenticated()) {
			res.render('home', {
				"loggedIn": true
			});
		} else {
			res.render('home', {
				"loggedIn": false
			});
		}
	}
}

module.exports = route;