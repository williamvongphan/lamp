let route = {
	"name": "leaderboard",
	"path": "/leaderboard",
	"method": "get",
	"handler": function (req, res) {
		res.render('leaderboard');
	}
}

module.exports = route;