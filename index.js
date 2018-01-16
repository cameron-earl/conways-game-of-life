let game,
	canv,
	ctx,
	width,
	size,
	loop,
	pauseButton,
	resetButton,
	fpsInput,
	sizeInput

window.onload = () => {
	canv = document.querySelector('#canv')
	pauseButton = document.querySelector('button#playbutton')
	resetButton = document.querySelector('button#resetbutton')
	stepButton = document.querySelector('button#stepbutton')
	fpsInput = document.querySelector('input#fps')
	sizeInput = document.querySelector('input#size')

	ctx = canv.getContext('2d')

	pauseButton.addEventListener('click', togglePause)
	resetButton.addEventListener('click', initialize)
	stepButton.addEventListener('click', ev => {
		pause()
		tick()
	})
	fpsInput.addEventListener('change', changeSpeed)
	sizeInput.addEventListener('change', initialize)

	initialize()
	play(fps)
}

function initialize() {
	pause()
	size = Number(sizeInput.value)
	game = new gameOfLife(size)
	width = canv.width / size
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
			if (grid[row][col]) {
				let x = width * col
				let y = width * row
				ctx.moveTo(x, y)
				ctx.rect(x, y, width, width)
			}
		}
	}
	ctx.closePath()
	ctx.fill()
}

function tick() {
	displayGrid()
	game.step()
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
