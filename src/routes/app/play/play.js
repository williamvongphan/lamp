let route = {
	"name": "play",
	"path": "/play",
	"method": "get",
	"handler": function (req, res) {
		if (req.isAuthenticated()) {
			res.render('play');
		} else {
			res.redirect('/choose');
		}
	}
}

module.exports = route;