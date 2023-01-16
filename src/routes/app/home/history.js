const HistorySchema = require('../../../models/History.js');

let route = {
	"name": "history",
	"path": "/history/:id",
	"method": "get",
	"handler": async function (req, res) {
		let history = await HistorySchema.findOne({ _id: req.params.id });
		if (history) {
			res.render('history', {
				"history": history
			});
		} else {
			res.render('history404', {
				"history": req.params.id
			});
		}
	}
}

module.exports = route;