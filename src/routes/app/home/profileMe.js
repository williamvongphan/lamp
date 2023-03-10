let route = {
	"name": "profile",
	"path": "/profile",
	"method": "get",
	"handler": function (req, res) {
		if (req.isAuthenticated()) {
			res.render('profile', {
				"username": req.user.username,
				"privacy": req.user.privateProfile
			});
		} else {
			res.redirect('/choose');
		}
	}
}

module.exports = route;