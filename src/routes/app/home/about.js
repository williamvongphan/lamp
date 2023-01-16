let route = {
	"name": "about",
	"path": "/about",
	"method": "get",
	"handler": function (req, res) {
		res.render('about');
	}
}

module.exports = route;