let route = {
	"name": "register",
	"path": "/register",
	"method": "get",
	"handler": function (req, res) {
		res.render('register');
	}
}

module.exports = route;