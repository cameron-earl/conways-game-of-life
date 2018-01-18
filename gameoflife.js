class gameOfLife {
	constructor(len = 100, empty = false) {
		this.grid = new Array(len)
			.fill('')
			.map(row =>
				new Array(len)
					.fill('')
					.map(cell => new Cell(empty ? false : undefined)),
			)
		this.livingCellCount = -1
	}

	getGrid() {
		return this.grid
	}

	step() {
		let len = this.grid.length
		let nextGrid = new Array(len).fill('').map(row => [])

		const wrap = n => (n < 0 ? len + n : n % len)

		const getNewCellStatus = (row, col) => {
			let sum = sumNeighbors(row, col)
			// console.log('sum', sum, row, col)
			return sum === 3 || (sum === 2 && this.grid[row][col].isAlive())
		}

		const sumNeighbors = (row, col) => {
			let sum = 0
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i || j) {
						sum += this.grid[wrap(row + i)][wrap(col + j)].isAlive()
					}
				}
			}
			return sum
		}

		// record what next status should be
		let livingCellCount = 0
		for (let row = 0; row < len; row++) {
			for (let col = 0; col < len; col++) {
				nextGrid[row][col] = getNewCellStatus(row, col)
				livingCellCount += nextGrid[row][col]
			}
		}
		this.livingCellCount = livingCellCount
		// set next status
		for (let row = 0; livingCellCount && row < len; row++) {
			for (let col = 0; col < len; col++) {
				this.grid[row][col].setAlive(nextGrid[row][col])
			}
		}
	}
}

const maxHealth = 400

class Cell {
	constructor(alive = Math.random() > 0.5) {
		this.health = maxHealth
		this.alive = alive
	}

	setAlive(alive = true) {
		this.alive = alive
		this.step()
	}

	isAlive() {
		return this.alive
	}

	step() {
		this.health = this.alive ? this.health - 1 : maxHealth
		this.health = Math.min(this.health, maxHealth)
		if (this.health <= 0) {
			this.alive = false
			this.health = 0
		}
	}

	valueOf() {
		return this.alive
	}
}
