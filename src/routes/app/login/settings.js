let route = {
	"name": "settings",
	"path": "/settings",
	"method": "get",
	"handler": function (req, res) {
		if (req.isAuthenticated()) {
			res.render('settings');
		} else {
			res.redirect('/choose');
		}
	}
}

module.exports = route;