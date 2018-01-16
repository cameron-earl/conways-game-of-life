class gameOfLife {
	constructor(size = 100) {
		this.grid = new Array(size)
			.fill([])
			.map(row => new Array(size).fill(0).map(cell => Math.random() > 0.5))
	}

	getGrid() {
		return this.grid
	}

	step() {
		let len = this.grid.length
		let nextGrid = new Array(len).fill('').map(e => [])
		const wrap = n => (n < 0 ? len + n : n % len)

		const getNewCellStatus = (row, col) => {
			let sum = sumNeighbors(row, col)
			// console.log('sum', sum, row, col)
			return sum === 3 || (sum === 2 && this.grid[row][col])
		}

		const sumNeighbors = (row, col) => {
			let sum = 0
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i || j) {
						sum += this.grid[wrap(row + i)][wrap(col + j)]
					}
				}
			}
			return sum
		}

		for (let row = 0; row < len; row++) {
			for (let col = 0; col < len; col++) {
				nextGrid[row][col] = getNewCellStatus(row, col)
				// console.log('update', row, col, nextGrid)
			}
		}
		this.grid = nextGrid
	}
}
