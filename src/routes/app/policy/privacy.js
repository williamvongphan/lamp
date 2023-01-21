let route = {
	"name": "privacy",
	"path": "/privacy",
	"method": "get",
	"handler": function (req, res) {
		res.render('privacy');
	}
}

module.exports = route;