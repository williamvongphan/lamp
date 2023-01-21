let route = {
	"name": "cookies",
	"path": "/cookies",
	"method": "get",
	"handler": function (req, res) {
		res.render('cookies');
	}
}

module.exports = route;