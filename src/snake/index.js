import "./style.css";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreNode = document.querySelector("#score");
const timerNode = document.querySelector("#timer");

const gridElement = 40; //20 elements sur 20
let snake = [
    [10, 9],
    [10, 10],
    [10, 11],
    [10, 12],
    [10, 13],
];
let snakeDirection = "top";
let apple = [];
let start = false;
let score = 0;
let timer = new Date();
let timerInterval;
let speed = 800;

//dessine la map
const drawMap = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 800);
};

//dessine le snake
const drawSnake = () => {
    //dessine un carré noir pour chaque elements du corp
    snake.forEach((e) => {
        ctx.fillStyle = "green";
        ctx.fillRect(
            e[0] * gridElement,
            e[1] * gridElement,
            gridElement,
            gridElement
        );
    });
};

const moveSnake = () => {
    //récupère la position actuel de la tête
    let headX = snake[0][0];
    let headY = snake[0][1];
    //met à jour la nouvelle position en fonction de la direction
    switch (snakeDirection) {
        case "top":
            headY--;
            break;
        case "bottom":
            headY++;
            break;
        case "right":
            headX++;
            break;
        case "left":
            headX--;
            break;
    }
    //ajoute un nouvel index 0 avec la nouvelle position
    snake.unshift([headX, headY]);
    //supprime le dernier élément sauf si la pomme est mangée
    if (!eatApple()) {
        snake.pop();
    } else {
        score++;
        speed = speed - 5;
        scoreNode.innerHTML = `score: ${score}`;
        apple = newApple();
    }
};

//genere une nouvelle pomme
const newApple = () => {
    const randomX = Math.round(Math.random() * 19);
    const randomY = Math.round(Math.random() * 19);
    const isValid = snake.some((e) => e[0] != randomX && e[1] != randomY);
    //check si la position génèrer est présente dans le snake
    if (isValid) {
        return [randomX, randomY];
    } else {
        return newApple();
    }
};

//dessine la pomme
const drawApple = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(
        apple[0] * gridElement,
        apple[1] * gridElement,
        gridElement,
        gridElement
    );
};

const eatApple = () => {
    if (snake[0][0] == apple[0] && snake[0][1] == apple[1]) {
        return true;
    } else {
        return false;
    }
};

//réinitialise les éléments du jeu
const reset = () => {
    snake = [
        [10, 9],
        [10, 10],
        [10, 11],
        [10, 12],
        [10, 13],
    ];
    snakeDirection = "top";
    apple = newApple();
    drawMap();
    drawSnake();
    drawApple();
    start = false;
    score = 0;
    scoreNode.innerHTML = "score: 0";
    timer.setTime(0);
    timerNode.innerHTML = "00:00";
    timerInterval = null;
};

//condition de défaite
const gameOver = () => {
    if (
        snake[0][0] < 0 ||
        snake[0][0] > 19 ||
        snake[0][1] < 0 ||
        snake[0][1] > 19
    ) {
        return true;
    } else {
        const [head, ...body] = snake;
        return body.some((e) => head[0] == e[0] && head[1] == e[1]);
    }
};

//actualisation du jeu
const animation = () => {
    if (!gameOver()) {
        setTimeout(() => {
            moveSnake();
            drawMap();
            drawSnake();
            drawApple();
            gameOver();
            requestAnimationFrame(animation);
        }, speed);
    } else {
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "75px sans-serif";
        ctx.fillText("GAME OVER", 400, 400);
        ctx.font = "40px sans-serif";
        ctx.fillText("score: " + score, 400, 460);
        ctx.font = "25px sans-serif";
        ctx.fillText("click to reset game", 400, 500);
        start = false;
        clearInterval(timerInterval);
    }
};

//démarre le jeu via un keydown
document.addEventListener("keydown", () => {
    if (!start) {
        requestAnimationFrame(animation);
        start = true;
        timer.setTime(0);
        timerInterval = setInterval(() => {
            timer.setMilliseconds(timer.getMilliseconds() + 1000);
            timerNode.innerHTML = `${timer.getMinutes()}:${timer.getSeconds()}`;
        }, 1000);
    }
});

//réinitialise le jeu apres un gameOver avec un mouseclick
canvas.addEventListener("click", () => {
    if (gameOver()) {
        reset();
    }
});

//choissis la direction du snake
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (snakeDirection == "bottom") {
                break;
            } else {
                snakeDirection = "top";
                break;
            }
        case "ArrowRight":
            if (snakeDirection == "left") {
                break;
            } else {
                snakeDirection = "right";
                break;
            }
        case "ArrowDown":
            if (snakeDirection == "top") {
                break;
            } else {
                snakeDirection = "bottom";
                break;
            }
        case "ArrowLeft":
            if (snakeDirection == "right") {
                break;
            } else {
                snakeDirection = "left";
                break;
            }
    }
});

reset();
