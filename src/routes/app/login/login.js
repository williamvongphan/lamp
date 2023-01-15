let route = {
	"name": "login",
	"path": "/login",
	"method": "get",
	"handler": function (req, res) {
		res.render('login');
	}
}

module.exports = route;