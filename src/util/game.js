const { Vector } = require('./linalgcas');

module.exports = {
	// Generate a challenge
	generateChallenge: function () {
		// Random starting vector
		let start = new Vector(2);
		// Choose dims between -10 and 10
		start.set(0, Math.random() * 20 - 10);
		start.set(1, Math.random() * 20 - 10);
		// Random end vector
		let end = new Vector(2);
		// Choose dims between -10 and 10
		end.set(0, Math.random() * 20 - 10);
		end.set(1, Math.random() * 20 - 10);
		// Solve for projection vector
		let projection = start.project(end);
		return {
			startingVector: start.toJSON(),
			projectionVector: end.toJSON(),
			solvedVector: projection.toJSON()
		}
	},

	score: function (submittedVector, solvedVector) {
		// Convert to vectors
		let submitted = Vector.fromArray(submittedVector);
		let solved = Vector.fromArray(solvedVector);
		// Compare each dimension in percent accuracy
		let scores = [];
		for (let i = 0; i < submitted.size; i++) {
			// Use a scale such that if the user is closer to the correct answer, they get a higher score (up to 100%) and if they are farther away, they get a lower score (down to 0%). Use a logarithmic scale to make the difference between 0 and 1 more significant than the difference between 9 and 10.
			let diff = Math.abs(submitted.get(i) - solved.get(i));
			let score = Math.abs(100 - 100 * Math.log10(diff + 1));
			scores.push(score);
		}
		// Return the average score
		return {
			score: scores.reduce((a, b) => a + b, 0) / scores.length,
			scores: scores
		};
	}
}