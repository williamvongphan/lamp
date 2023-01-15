let route = {
	"name": "home",
	"path": "/",
	"method": "get",
	"handler": function (req, res) {
		res.render('home');
	}
}

module.exports = route;