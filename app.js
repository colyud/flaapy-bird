const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// load images

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();

let gap = 75;
let birdX = 10;
let birdY = 150;
let gravity = 1.5;
var fpsInterval,
    startTime,
    now,
    then,
    elapsed,
    delay = 0;
let score = 0;

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

// bird.onload = draw;
// bg.onload = draw;
// fg.onload = draw;
// pipeNorth.onload = draw;
pipeSouth.onload = () => {
    startAnimating(50);
};

bird.src = "./sprites/yellowbird-up flap.png";
bg.src = "./sprites/background-day.png";
fg.src = "./sprites/base.png";
pipeNorth.src = "./sprites/pipe-green-north.png";
pipeSouth.src = "./sprites/pipe-green.png";

document.addEventListener("keydown", moveUp);
function moveUp() {
    birdY -= 25;
    fly.play();
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    draw();
}
//draw images

function draw() {
    requestAnimationFrame(draw);
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        bird.src == "https://flappybird.duyloc.dev/sprites/yellowbird-upflap.png" && delay % 5 == 0
            ? (bird.src = "./sprites/yellowbird-midflap.png")
            : bird.src == "https://flappybird.duyloc.dev/sprites/yellowbird-midflap.png"
            ? (bird.src = "./sprites/yellowbird-downflap.png")
            : (bird.src = "./sprites/yellowbird-upflap.png");
        delay++;
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
            if (
                (birdX + bird.width >= pipe[i].x &&
                    birdX <= pipe[i].x + pipeNorth.width &&
                    (birdY <= pipe[i].y + pipeNorth.height || birdY + bird.height >= pipe[i].y + pipeNorth.height + gap)) ||
                birdY + bird.height >= cvs.height - fg.height
            ) {
                location.reload();
            }
            if (pipe[i].x == 5) {
                score++;
                scoreAudio.play();
            }
        }

        ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.drawImage(bird, birdX, birdY);

        birdY += gravity;

        ctx.fillStyle = "#000";
        ctx.font = "20px verdana";
        ctx.fillText("Score :" + score, 10, cvs.height - 20);
    }
}
