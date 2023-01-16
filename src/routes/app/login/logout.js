let route = {
	"name": "logout",
	"path": "/logout",
	"method": "get",
	"handler": function (req, res) {
		if (req.isAuthenticated()) {
			res.render('logout');
		} else {
			res.redirect('/choose');
		}
	}
}

module.exports = route;