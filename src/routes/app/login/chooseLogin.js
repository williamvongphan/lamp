let route = {
	"name": "choose",
	"path": "/choose",
	"method": "get",
	"handler": function (req, res) {
		res.render('chooseLogin');
	}
}

module.exports = route;