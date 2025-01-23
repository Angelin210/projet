
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const introImage = new Image();
introImage.src = "imagedecouverture.jpg";

introImage.onload = function () {
    drawIntroImage();
};

const paddleHeight = 10;
const paddleWidth = 75;

const brickRowCount = 14;
const brickColumnCount = 18;
const brickWidth = 42;
const brickHeight = 19;
const brickPadding = 10;
const brickOffsetTop = 20;
const brickOffsetLeft = 20;
const ballRadius = 10;

const ballImage = new Image();
ballImage.src = "Sharingan.jpg";

let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


let paddleX = (canvas.width - paddleWidth) / 2;

let rightpressed = false;
let leftpressed = false;


let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let interval = 0;

let score = 0;
let lives = 3;

let gameStarted = false;

ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgb(0 0 255 / 0.5)";
ctx.stroke();
ctx.closePath();


function update() {
    if (!gameStarted) return; // Si le jeu n'a pas démarré, on ne fait rien

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie le canvas
    drawBall(); // Dessine la balle
}

function drawBall() {
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawIntroImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie le canvas
    ctx.drawImage(introImage, 0, 0, canvas.width, canvas.height); // Affiche l'image d'intro
}

const updateScore = async (updateData) => {
    try {
        const response = await fetch('http://localhost:1337/api/game-projets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: updateData
            }),
        }); // Remplace "articles" par ta collection
        const data = await response.json();
        console.log(data); // Affiche les données de la collection
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
    }
};

async function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                console.log(score);
                const userEmail = localStorage.getItem("email")
                console.log(userEmail);
                try {
                    await updateScore({
                        email: userEmail,
                        score: score,
                        date: new Date(),
                    })

                    alert("GAME OVER");

                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                } catch (error) { console.log(error); }

            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
                dx = dx > 0 ? dx + 1 : dx - 1;
                dy = dy > 0 ? dy + 1 : dy - 1;
            }
        }
        requestAnimationFrame(draw);
    }


    x += dx;
    y += dy;
    if (rightpressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftpressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
}

ballImage.onload = function () {
    document.getElementById("runButton").addEventListener("click", draw);
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        console.log();
        rightpressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        console.log();
        leftpressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        console.log();
        rightpressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        console.log();
        leftpressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                console.log();
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("C'EST BIEN ÇA !!!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#cb0000";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#cb0000";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


function startGame() {
    interval = setInterval(draw, 10);

}

// Initialise le client Auth0 dès que le script est chargé


document.getElementById("runButton").addEventListener("click", function () {
    if (interval === 0) {
        gameStarted = true;
        startGame();
    }
});
