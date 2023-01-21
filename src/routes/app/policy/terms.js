let route = {
	"name": "terms",
	"path": "/terms",
	"method": "get",
	"handler": function (req, res) {
		res.render('terms');
	}
}

module.exports = route;