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
		// Check if any of the vector projection's dimensions go over or below 10 (the max)
		// If so, generate a new challenge
		if (projection.get(0) > 10 || projection.get(0) < -10 || projection.get(1) > 10 || projection.get(1) < -10) {
			return this.generateChallenge();
		}
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
		let scores = [];
		let dot = submitted.dot(solved);
		let mag1 = submitted.magnitude();
		let mag2 = solved.magnitude();
		let cos = dot / (mag1 * mag2);
		let cosine = (cos + 1) * 50;
		scores.push(cosine);
		// Use a magnitude-based score (but not euclidean distance, because that can return negative values)
		let mag = Math.abs(submitted.magnitude() - solved.magnitude());
		let magScore = 100 - Math.log10(mag + 1) * (100 / Math.sqrt(2));
		scores.push(magScore);
		// Calculate Chebyshev distance
		let chebyshev = 0;
		for (let i = 0; i < submitted.dims(); i++) {
			let diff = Math.abs(submitted.get(i) - solved.get(i));
			if (diff > chebyshev) {
				chebyshev = diff;
			}
		}
		let chebyshevScore = 100 - Math.log10(chebyshev + 1) * (100 / Math.sqrt(2));
		scores.push(chebyshevScore);
		// If any score is null, NaN, or Infinity, replace it with 0
		for (let i = 0; i < scores.length; i++) {
			if (scores[i] === null || isNaN(scores[i]) || !isFinite(scores[i])) {
				scores[i] = 0;
			}
		}
		// Calculate the average score
		let score = 0;
		for (let i = 0; i < scores.length; i++) {
			score += scores[i];
		}
		score /= scores.length;
		return {
			score: score,
			scores: scores
		};
	}
}