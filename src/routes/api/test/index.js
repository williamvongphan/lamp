let route = {
	"name": "test",
	"path": "/test",
	"method": "get",
	"ratelimit": {
		"active": true,
		"window": 5000,
		"max": 10
	},
	"authentication": {
		"active": false,
	},
	"handler": function (req, res) {
		res.send('Hello World!');
	}
}

module.exports = route;