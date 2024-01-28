const canv = document.querySelector("canvas");
const ctx = canv.getContext("2d");

const sizeWidth = 25;
const sizeHeight = 25;

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");

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

let appleX, appleY, snake;

let boxSize;

let interval,
	direction = 0; // 0: left, 1: up, 2: right, 3: down

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

function init() {
	snake = [[Math.round(sizeWidth / 2), Math.round(sizeHeight / 2)]];

	setApple();
}

function end() {
	clearInterval(interval);

	interval = null;
}

function win() {
	alert("You win!");
	end();
}

function lose() {
	alert("You lose!");
	end();
}

function setApple() {
	if (sizeWidth * sizeHeight <= snake.length) return win();

	appleX = Math.floor(Math.random() * sizeWidth) + 1;
	appleY = Math.floor(Math.random() * sizeHeight) + 1;

	for (const [bodyX, bodyY] of snake) {
		if (appleX === bodyX && appleY === bodyY) return setApple();
	}
}

function main() {
	init();
	resize();

	interval = setInterval(update, 500);

	render();
}

function update() {
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

	if (snake[0][0] !== appleX || snake[0][1] !== appleY) snake.pop();
	else setApple();

	console.log({ snake, apple: { x: appleX, y: appleY }, direction });

	for (const [bodyX, bodyY] of snake.slice(1, snake.length)) {
		if (bodyX === x && bodyY === y) return lose();
	}
}

function render() {
        if (!interval) return;

        requestAnimationFrame(render);

	ctx.fillStyle = "black";

	ctx.fillRect(0, 0, canv.width, canv.height);

	for (let i = 0; i < snake.length; i++) {
		const [x, y] = snake[i];

		ctx.fillStyle = i ? "green" : "white";

		ctx.fillRect(boxSize * (x - 1), boxSize * (y - 1), boxSize, boxSize);
	}

	ctx.fillStyle = "red";

	ctx.fillRect(
		boxSize * (appleX - 1),
		boxSize * (appleY - 1),
		boxSize,
		boxSize,
	);
}

window.addEventListener("resize", resize);
window.addEventListener("load", main);
//window.addEventListener("touchstart", handleMobileControl);
