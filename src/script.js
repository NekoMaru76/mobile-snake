const canv = document.querySelector("canvas");
const ctx = canv.getContext("2d");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const wallButton = document.getElementById("wall");

const sizeWidth = 25;
const sizeHeight = 25;

let apple, snake, boxSize;
let isPlaying = false,
	isEnd = false,
	isWallEnabled = true,
	direction = 0; // 0: left, 1: up, 2: right, 3: down

leftButton.addEventListener("click", () => {
	if (direction !== 2) direction = 0;
});
rightButton.addEventListener("click", () => {
	if (direction !== 0) direction = 2;
});
upButton.addEventListener("click", () => {
	if (direction !== 3) direction = 1;
});
downButton.addEventListener("click", () => {
	if (direction !== 1) direction = 3;
});
pauseButton.addEventListener("click", pause);
startButton.addEventListener("click", start);
resetButton.addEventListener("click", reset);
wallButton.addEventListener("click", wall);

function wall() {
	isWallEnabled = !isWallEnabled;
}

function pause() {
	isPlaying = false;
	isEnd = false;
}

function start() {
	if (isEnd) init();

	isPlaying = true;
	isEnd = false;
}

function reset() {
	init();

	isPlaying = false;
	isEnd = false;
}

function end() {
	isPlaying = false;
	isEnd = true;
}

function win() {
	alert("You win!");
	end();
}

function lose() {
	alert("You lose!");
	end();
}

function setSnake() {
	snake = [[Math.round(sizeWidth / 2), Math.round(sizeHeight / 2)]];
}

function init() {
	setSnake();
	setApple();
}

function setApple() {
	if (sizeWidth * sizeHeight <= snake.length) return win();

	apple = {
		x: Math.floor(Math.random() * sizeWidth) + 1,
		y: Math.floor(Math.random() * sizeHeight) + 1,
	};

	for (const [bodyX, bodyY] of snake) {
		if (apple.x === bodyX && apple.y === bodyY) return setApple();
	}
}

function setup() {
	clock();
	resize();
	init();
}

function clock() {
	setInterval(update, 500);
}

function resize() {
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;

	if (winWidth < winHeight) {
		boxSize = Math.floor(winWidth / sizeWidth);

		canv.width = winWidth;
		canv.height = boxSize * sizeHeight;
	} else {
		boxSize = Math.floor(winHeight / sizeHeight);

		canv.height = winHeight;
		canv.width = boxSize * sizeWidth;
	}
}

function update() {
	if (isPlaying)  {
		let [x, y] = snake[0];

		switch (direction) {
			case 0:
				if (--x < 1) x = sizeWidth;
				break;
			case 1:
				if (--y < 1) y = sizeHeight;
				break;
			case 2:
				if (++x > sizeWidth) x = 1;
				break;
			case 3:
				if (++y > sizeHeight) y = 1;
				break;
		}

		snake.splice(0, 0, [x, y]);

		if (snake[0][0] !== apple.x || snake[0][1] !== apple.y) snake.pop();
		else setApple();

		for (const [bodyX, bodyY] of snake.slice(1, snake.length)) {
			if (bodyX === x && bodyY === y) return lose();
		}
	}

	render();
}

function render() {
	ctx.fillStyle = isWallEnabled ? "black" : "yellow";

	ctx.fillRect(0, 0, canv.width, canv.height);

	if (snake)
		for (let i = 0; i < snake.length; i++) {
			const [x, y] = snake[i];

			ctx.fillStyle = i ? "green" : "white";

			ctx.fillRect(
				boxSize * (x - 1),
				boxSize * (y - 1),
				boxSize,
				boxSize,
			);
		}

	if (!apple) return;

	ctx.fillStyle = "red";

	ctx.fillRect(
		boxSize * (apple.x - 1),
		boxSize * (apple.y - 1),
		boxSize,
		boxSize,
	);
}

window.addEventListener("resize", resize);
window.addEventListener("load", setup);