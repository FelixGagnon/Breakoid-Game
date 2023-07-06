document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var interval = null;
var gameStop = true;
var brickLeft = 18;
var level = 0;
var score = 0;
var lifeLeft = 3;
var ballSize = 24;
var paddleHeight = 20;
var paddleWidth = 115;
var paddleX = (canvas.width - paddleWidth)/2;
var x = (canvas.width/2)-(ballSize/2);
var y = canvas.height - 40;
var dx = 3;
var dy = -3;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var brickRowCount = 3;
var brickColumnCount = 6;
var brickWidth = 108;
var brickHeight = 32;
var brickPadding = 10;
var brickOffsetTop = 10;
var brickOffsetLeft = 10;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    brickLeft--;
                    console.log(score);
                    if(brickLeft == 0) {
                        level++;
                        brickLeft = 30
                        if (level = 2) {
                            alert("Next Level");
                            canvas.style.backgroundImage="url(images/retro_bg2.jpg)";
                            reset();
                        }
                        if (level = 3) {
                            alert("Next Level");
                            canvas.style.backgroundImage="url(images/retro_bg3.jpg)";
                        }
                        if (level = 4) {
                            alert("You Win!");
                            
                        }

                    }
                }
            }
        }
    }
}



//key pressed handler
function keyDownHandler(e) {
    if(e.key == "d" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "a" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == " ") {
        spacePressed = true;
    }
}

//key release handler
function keyUpHandler(e) {
    if(e.key == "d" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "a" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == " ") {
        spacePressed = false;
    }
}

//Draw the paddle
function drawPaddle() {
    var paddleImage = new Image(paddleWidth, paddleHeight);
    paddleImage.src = 'images/paddle.png';
    ctx.drawImage(paddleImage, paddleX, canvas.height-20);
}

//Draw the ball
function drawBall() {
    var ballImage = new Image(ballSize, ballSize);
    ballImage.src = 'images/ball.png';
    ctx.drawImage(ballImage, x, y);
}

//reset the game
function reset() {
    gameStop = true;
    paddleX = (canvas.width - paddleWidth)/2;
    x = (canvas.width - ballSize)/2;
    y = canvas.height-40;
    dx = 3;
    dy = -3;
    rightPressed = false;
    leftPressed = false;
}



function newGame() {
    score = 0;
    lifeLeft = 5;
    reset();
}


//setup game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    collisionDetection();
    if(rightPressed) {
        paddleX += 5;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        } 
        if (gameStop) {
            x +=5;
            if (x + (paddleWidth/2) + (ballSize/2) > canvas.width) {
                x = canvas.width - (paddleWidth/2) - (ballSize/2);
            }
        }
    } 
    if(leftPressed) {
        paddleX -= 5;
        if (paddleX < 0){
            paddleX = 0;
        } 
        if (gameStop) {
            x -=5;
            if (x - (paddleWidth/2) < 0) {
                x = (paddleWidth/2) - (ballSize/2);
            }  
        }
    } 
    if(spacePressed) {
        gameStop = false;
    }
    if (!gameStop) {
        if (x + dx > canvas.width-ballSize || x + dx < 0) {
            dx = -dx;
        }
        if (y + dy < 0) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - 40) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lifeLeft--;
                if (lifeLeft > 0) {
                    reset();
                } 
                else {
                    reset();
                    alert("GAME OVER!");
                    document.location.reload();
                    clearInterval(interval);
                    
                } 
            }
        }
        x += dx;
        y += dy;
    }  
}



//start game loop
var startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click",  e => {
    level = 1;
    startBtn.style.display="none";
    canvas.style.backgroundImage="url(images/retro_bg1.jpg)";
    interval = setInterval(draw, 10);
});
