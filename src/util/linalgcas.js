class Vector {
	constructor(size) {
		this.size = size;
		this.data = new Array(size);
	}

	get(index) {
		return this.data[index];
	}

	set(index, value) {
		this.data[index] = value;
	}

	add(vector) {
		if (this.size !== vector.size) {
			throw new Error('Vector sizes do not match.');
		}
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) + vector.get(i));
		}
		return result;
	}

	subtract(vector) {
		if (this.size !== vector.size) {
			throw new Error('Vector sizes do not match.');
		}
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) - vector.get(i));
		}
		return result;
	}

	multiply(vector) {
		if (this.size !== vector.size) {
			throw new Error('Vector sizes do not match.');
		}
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) * vector.get(i));
		}
		return result;
	}

	divide(vector) {
		if (this.size !== vector.size) {
			throw new Error('Vector sizes do not match.');
		}
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) / vector.get(i));
		}
		return result;
	}

	addScalar(scalar) {
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) + scalar);
		}
		return result;
	}

	subtractScalar(scalar) {
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) - scalar);
		}
		return result;
	}

	multiplyScalar(scalar) {
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) * scalar);
		}
		return result;
	}

	divideScalar(scalar) {
		let result = new Vector(this.size);
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) / scalar);
		}
		return result;
	}

	dot(vector) {
		if (this.size !== vector.size) {
			throw new Error('Vector sizes do not match.');
		}
		let result = 0;
		for (let i = 0; i < this.size; i++) {
			result += this.get(i) * vector.get(i);
		}
		return result;
	}

	cross(vector) {
		if (this.size !== 3 || vector.size !== 3) {
			throw new Error('Cross product is only defined for 3D vectors.');
		}
		let result = new Vector(3);
		result.set(0, this.get(1) * vector.get(2) - this.get(2) * vector.get(1));
		result.set(1, this.get(2) * vector.get(0) - this.get(0) * vector.get(2));
		result.set(2, this.get(0) * vector.get(1) - this.get(1) * vector.get(0));
		return result;
	}

	length() {
		let result = 0;
		for (let i = 0; i < this.size; i++) {
			result += this.get(i) * this.get(i);
		}
		return Math.sqrt(result);
	}

	normalize() {
		let result = new Vector(this.size);
		let length = this.length();
		for (let i = 0; i < this.size; i++) {
			result.set(i, this.get(i) / length);
		}
		return result;
	}

	toString() {
		let result = "[";
		for (let i = 0; i < this.size; i++) {
			result += this.get(i);
			if (i < this.size - 1) {
				result += ", ";
			}
		}
		result += "]";
		return result;
	}

	static fromArray(array) {
		let result = new Vector(array.length);
		for (let i = 0; i < array.length; i++) {
			result.set(i, array[i]);
		}
		return result;
	}

	magnitude() {
		return this.length();
	}

	project(vector) {
		let dotProduct = this.dot(vector);
		let magnitude = vector.magnitude();
		return vector.multiplyScalar(dotProduct / (magnitude * magnitude));
	}

	toJSON() {
		return this.data;
	}
}

class Matrix {
	constructor(rows, columns) {
		this.rows = rows;
		this.columns = columns;
		this.data = new Array(rows * columns);
	}

	get(row, column) {
		return this.data[row * this.columns + column];
	}

	set(row, column, value) {
		this.data[row * this.columns + column] = value;
	}

	add(matrix) {
		if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
			throw new Error('Matrix sizes do not match.');
		}
		let result = new Matrix(this.rows, this.columns);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				result.set(i, j, this.get(i, j) + matrix.get(i, j));
			}
		}
		return result;
	}

	subtract(matrix) {
		if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
			throw new Error('Matrix sizes do not match.');
		}
		let result = new Matrix(this.rows, this.columns);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				result.set(i, j, this.get(i, j) - matrix.get(i, j));
			}
		}
		return result;
	}

	multiply(matrix) {
		if (this.columns !== matrix.rows) {
			throw new Error('Matrix sizes do not match.');
		}
		let result = new Matrix(this.rows, matrix.columns);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < matrix.columns; j++) {
				let sum = 0;
				for (let k = 0; k < this.columns; k++) {
					sum += this.get(i, k) * matrix.get(k, j);
				}
				result.set(i, j, sum);
			}
		}
		return result;
	}

	multiplyVector(vector) {
		if (this.columns !== vector.size) {
			throw new Error('Matrix and vector sizes do not match.');
		}
		let result = new Vector(this.rows);
		for (let i = 0; i < this.rows; i++) {
			let sum = 0;
			for (let j = 0; j < this.columns; j++) {
				sum += this.get(i, j) * vector.get(j);
			}
			result.set(i, sum);
		}
		return result;
	}

	multiplyScalar(scalar) {
		let result = new Matrix(this.rows, this.columns);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				result.set(i, j, this.get(i, j) * scalar);
			}
		}
		return result;
	}

	transpose() {
		let result = new Matrix(this.columns, this.rows);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				result.set(j, i, this.get(i, j));
			}
		}
		return result;
	}

	toString() {
		let result = "";
		for (let i = 0; i < this.rows; i++) {
			let resultRow = "";
			for (let j = 0; j < this.columns; j++) {
				resultRow += this.get(i, j);
				if (j < this.columns - 1) {
					resultRow += ", ";
				}
			}
			result += resultRow + "\r\n";
		}
		return result;
	}

	static fromArray(array) {
		let result = new Matrix(array.length, 1);
		for (let i = 0; i < array.length; i++) {
			result.set(i, 0, array[i]);
		}
		return result;
	}

	static fromArray2D(array) {
		let result = new Matrix(array.length, array[0].length);
		for (let i = 0; i < array.length; i++) {
			for (let j = 0; j < array[i].length; j++) {
				result.set(i, j, array[i][j]);
			}
		}
		return result;
	}

	static identity(size) {
		let result = new Matrix(size, size);
		for (let i = 0; i < size; i++) {
			result.set(i, i, 1);
		}
		return result;
	}

	static random(rows, columns) {
		let result = new Matrix(rows, columns);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				result.set(i, j, Math.random() * 2 - 1);
			}
		}
		return result;
	}
}

module.exports = {
	Vector: Vector,
	Matrix: Matrix,
}