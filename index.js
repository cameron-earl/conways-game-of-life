let game,
	canv,
	ctx,
	cellWidth,
	size,
	loop,
	pauseButton,
	resetButton,
	fpsInput,
	sizeInput,
	mousedown = false

window.onload = () => {
	canv = document.querySelector('#canv')
	pauseButton = document.querySelector('button#playbutton')
	resetButton = document.querySelector('button#resetbutton')
	stepButton = document.querySelector('button#stepbutton')
	clearButton = document.querySelector('button#clearbutton')
	fpsInput = document.querySelector('input#fps')
	sizeInput = document.querySelector('input#size')
	cellCount = document.querySelector('span#cellcount')

	ctx = canv.getContext('2d')

	pauseButton.addEventListener('click', togglePause)
	resetButton.addEventListener('click', initialize)
	stepButton.addEventListener('click', ev => {
		pause()
		tick()
	})
	clearButton.addEventListener('click', ev => initialize(true))
	fpsInput.addEventListener('change', changeSpeed)
	sizeInput.addEventListener('change', initialize)

	canv.addEventListener('click', handleClick)
	canv.addEventListener('contextmenu', handleClick)

	window.addEventListener('mousedown', ev => (mousedown = true))
	window.addEventListener('mouseup', ev => (mousedown = false))
	canv.addEventListener('mousemove', ev => {
		if (mousedown) handleClick(ev)
	})

	initialize()
	play(fps)
}

function handleClick(ev) {
	// console.log(ev)
	ev.preventDefault()
	let alive = ev.which === 1
	let row = Math.floor(ev.layerY / cellWidth)
	let col = Math.floor(ev.layerX / cellWidth)
	let cell = game.getGrid()[row][col]
	if (cell.isAlive() === alive) return
	cell.setAlive(alive)
	drawCell(row, col)
	console.log(row, col, game.getGrid()[row][col])
}

function initialize(empty = false) {
	empty = empty === true ? true : false
	size = Number(sizeInput.value)
	game = new gameOfLife(size, empty)
	cellWidth = canv.width / size
	displayGrid()
}

function changeSpeed() {
	if (pauseButton.textContent === 'Pause') play()
}

function displayGrid() {
	ctx.clearRect(0, 0, canv.width, canv.height)
	ctx.fillStyle = '#000000'
	let grid = game.getGrid()
	ctx.beginPath()
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid.length; col++) {
			if (grid[row][col].isAlive()) {
				addCellToPath(row, col)
			}
		}
	}
	ctx.closePath()
	ctx.fill()
}

function addCellToPath(row, col) {
	let x = cellWidth * col
	let y = cellWidth * row
	ctx.moveTo(x, y)
	ctx.rect(x, y, cellWidth, cellWidth)
}

function drawCell(row, col) {
	ctx.fillStyle = game.getGrid()[row][col].isAlive() ? '#000000' : '#FFFFFF'
	ctx.beginPath()
	addCellToPath(row, col)
	ctx.closePath()
	ctx.fill()
}

function tick() {
	game.step()
	displayGrid()
	cellCount.textContent = game.livingCellCount
	if (!game.livingCellCount) pause()
}

function togglePause(ev) {
	pauseButton.textContent === 'Pause' ? pause() : play()
}

function pause() {
	clearInterval(loop)
	pauseButton.textContent = 'Play'
}

function play() {
	clearInterval(loop)
	pauseButton.textContent = 'Pause'
	let fps = Number(fpsInput.value)
	loop = setInterval(tick, 1000 / fps)
}
