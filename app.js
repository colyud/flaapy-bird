const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const gameOverCvs = document.getElementById("gameOverCanvas");
const gameOverCtx = gameOverCvs.getContext("2d");

// load images

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();
let gameOver = new Image();

let gap = 75;
let birdX = 10;
let birdY = 150;
let gravity = 1.5;

let score = 0;
let play = true;
let requestId; // requestAnimationOnFrame
let gameLoop, birdType; // interval

let yellowbirdDOM = document.querySelector("#yellowbird");
let redbirdDOM = document.querySelector("#redbird");
let bluebirdDOM = document.querySelector("#bluebird");
let flapType = "upflap";
let birdColor = "yellow";

// load audio
let fly = new Audio();
let scoreAudio = new Audio();

let pipe = [];
pipe[0] = {
    x: cvs.width,
    y: 0,
};

fly.src = "./audio/wing.ogg";
scoreAudio.src = "./audio/point.ogg";

bird.src = "./sprites/yellowbird-upflap.png";
bg.src = "./sprites/background-day.png";
fg.src = "./sprites/base.png";
pipeNorth.src = "./sprites/pipe-green-north.png";
pipeSouth.src = "./sprites/pipe-green.png";
gameOver.src = "./sprites/gameover.png";

pipeNorth.style.zIndex = 1;
pipeSouth.style.zIndex = 1;
gameOver.style.zIndex = 1000;

function control() {}

// fly up
document.addEventListener("keydown", moveUp);
function moveUp(e) {
    if (e.which == 32) {
        birdY -= 25;
        gravity = 1.5;
        fly.play();
    }
}

//restart game
function restart(e) {
    if (e.which == 32) {
        startGame();
        document.removeEventListener("keypress", restart);
    }
}
//start game
const startGame = () => {
    birdX = 10;
    birdY = 150;

    score = 0;
    play = true;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    document.removeEventListener("keypress", restart);
    gameOverCtx.clearRect(0, 0, gameOverCvs.width, gameOverCvs.height);
    pipe = [];
    pipe[0] = {
        x: cvs.width,
        y: 0,
    };
    gameLoop = setInterval(draw, 30);
};
//game over
const endGame = () => {
    play = false;
    clearInterval(gameLoop);
    gameOverCtx.drawImage(gameOver, cvs.width / 2 - gameOver.width / 2, 250);

    document.addEventListener("keypress", restart);
};

//draw images
function draw() {
    if (play) {
        ctx.drawImage(bg, 0, 0);

        for (let i = 0; i < pipe.length; i++) {
            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + pipeNorth.height + gap);
            pipe[i].x--;

            if (pipe[i].x == 125) {
                pipe.push({
                    x: cvs.width,
                    y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
                });
            }
            if (pipe[i].x == 5) {
                score++;
                scoreAudio.play();
            }
            if (
                (birdX + bird.width >= pipe[i].x &&
                    birdX <= pipe[i].x + pipeNorth.width &&
                    (birdY <= pipe[i].y + pipeNorth.height || birdY + bird.height >= pipe[i].y + pipeNorth.height + gap)) ||
                birdY + bird.height >= cvs.height - fg.height
            ) {
                endGame();
            }
        }

        ctx.drawImage(fg, 0, cvs.height - fg.height);
        ctx.drawImage(bird, birdX, birdY);

        birdY += gravity;
        gravity += 0.25;

        ctx.fillStyle = "#000";
        ctx.font = "20px verdana";
        ctx.fillText("Score :" + score, 10, cvs.height - 20);
        //requestId = window.requestAnimationFrame(draw);
    }
}

window.onload = startGame();

//bird type
yellowbirdDOM.addEventListener("click", () => (birdColor = "yellow"));
redbirdDOM.addEventListener("click", () => (birdColor = "red"));
bluebirdDOM.addEventListener("click", () => (birdColor = "blue"));

birdType = setInterval(() => {
    if (bird.getAttribute("src") == `./sprites/${birdColor}bird-upflap.png`) {
        flapType = "midflap";
    } else if (bird.getAttribute("src") == `./sprites/${birdColor}bird-midflap.png`) {
        flapType = "downflap";
    } else flapType = "upflap";

    bird.src = `./sprites/${birdColor}bird-${flapType}.png`;
}, 200);
