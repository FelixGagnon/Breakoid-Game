var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var scoreInput = document.getElementById("score_input");
var lifesHolder = document.getElementById("lifes_sprite");
var startBtn = document.getElementById("startBtn");
var gameWrapper = document.getElementById("game_wrapper");

var paused = false;
var mouse = false;
let loop;
var gameStop = true;
var brickLeft = 32;
var level = 0;
var score = 0;
var lifeLost = 0;
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
var brickRowCount = 4;
var brickColumnCount = 8;
var brickWidth = 76;
var brickHeight = 28;
var brickPadding = 10;
var brickOffsetTop = 20;
var brickOffsetLeft = 20;
var bricks = [];
var inLoading = false;

window.addEventListener('keydown', pauseGameKeyHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

anime({
    targets: '.canvas',
    translateX: 250,
    direction: 'reverse',
    easing: 'easeInOutSine'
  });

function onStart() {
    loop = requestAnimationFrame(draw);
  }
  
function onStop() {
    cancelAnimationFrame(loop);
  }

anime({
    targets: startBtn,
    scale: 1.5,
    direction: 'alternate',
    loop: true,
    easing: 'spring(1, 80, 30, 0)'
  });


function bricksIni() {
    bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
} 

const level1 = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 1],
    [4, 5, 10, 7, 8, 9, 1, 10, 3, 2],
    [5, 6, 7, 1, 2, 3, 5, 8, 1, 4]
  ];

  class Brick {
    constructor(xAxis, yAxis, color, status) {
      this.bottomLeft = [xAxis, yAxis]
      this.bottomRight = [xAxis + brickWidth, yAxis]
      this.topRight = [xAxis + brickWidth, yAxis + brickHeight]
      this.topLeft = [xAxis, yAxis + brickHeight]
      this.color = color;
      this.status = status;
      this.x = xAxis;
      this.y = yAxis;
    }
  }



function buildLevel(level) {
    let bricks = [];
  
    level.forEach((row, rowIndex) => {
      row.forEach((brick, brickIndex) => {
        var brickX = (brickIndex*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (rowIndex*(brickHeight+brickPadding))+brickOffsetTop;  
        var color; 
        var status = 1;
          
          switch(brick) {
            case 1 : 
                color = "yellow";
            break;
            case 2 : 
                color = "brown";
            break;  
            case 3 : 
                color = "red";
            break;
            case 4 : 
                color = "purple";
                break;  
            case 5 : 
                color = "blue";
            break;
            case 6 : 
                color = "orange";
            break;  
            case 7 : 
                color = "grey";
            break;
            case 8 : 
                color = "green";
            break;              
            case 9 : 
                color = "navy";
            break;  
            case 10 : 
                color = "black";
            break;
            case 11 : 
                color = "special";
            break;   
          };
          bricks.push(new Brick(brickX, brickY, color, status));
      });
    });
    return bricks;
}


    
var onLife, zeroLife;
function printScore() {
    scoreInput.innerHTML = score;
}
function printLife() {
    clearInterval(onLife);
    clearInterval(zeroLife);
    if (lifeLost == 3){
        lifesHolder.style.backgroundPositionX = "268px";
    }
    if (lifeLost == 2){
        lifesHolder.style.backgroundPositionX = "536px";
        oneLife = setInterval(function(){lifesHolder.style.backgroundPositionX = "268px";}, 1000);
        setTimeout(function() {zeroLife = setInterval(function(){lifesHolder.style.backgroundPositionX = "536px";}, 1000)}, 500);
    }
    if (lifeLost == 1){
        lifesHolder.style.backgroundPositionX = "804px";
    }
    if (lifeLost == 0){
        lifesHolder.style.backgroundPositionX = "0px";
    }
    
}


function drawBricks(level) {
    for(var b=0; b < bricks.length; b++){
        if (Brick.status == 1) {
            ctx.beginPath();
            ctx.rect(Brick.x, Brick.y, brickWidth, brickHeight);
            ctx.fillStyle = Brick.color;
            ctx.fill();
            ctx.closePath();
        }
    }



    // for(var c=0; c<brickColumnCount; c++) {
    //     for(var r=0; r<brickRowCount; r++) {
    //         if(bricks[c][r].status == 1) {
                // var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                // var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                // bricks[c][r].x = brickX;
    //             // bricks[c][r].y = brickY;
    //             ctx.beginPath();
    //             ctx.rect(brickX, brickY, brickWidth, brickHeight);
    //             ctx.fillStyle = color;
    //             ctx.fill();
    //             ctx.closePath();
    //         }    
    //     }
    // }
    //buildLevel(level);
    //addBricks();

}

function animateScore() {
    if(score === 100 || score === 200 || score === 300 || score === 400 || score === 500 || score === 600 || score === 700 || score === 800 || score === 900 || score === 1000) {
        anime({
            targets: scoreInput,
            scale: 1.5,
            direction: 'alternate',
            easing: 'spring(1, 80, 30, 0)'
          });
    }
}

function animateLastLife() {
    if (lifeLost == 2) {
        anime({
            targets: lifesHolder,
            opacity: 35,
            direction: 'alternate',
            loop: true,
            easing: 'spring(10, 80, 30, 40)'
          });
    }
}

function isWin() {
    if (brickLeft == 0) {
        level++;
        canvas.style.backgroundImage="url(images/levelcompleted.jpg)"
        reset();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        gameStop = true;
        inLoading = true;
        paused = true;
        setTimeout(function(){
            if (level == 2) {
                canvas.style.backgroundImage="url(images/retro_bg2.jpg)";
                paused = false;
                bricksIni();
                draw();  
            }   
            if (level == 3) {
                    canvas.style.backgroundImage="url(images/retro_bg3.jpg)";
                    bricksIni();
                    paused = false;
                    draw();
            }
            if (level == 4) {
                    canvas.style.backgroundImage="url(images/gameover.jpg)";
                    startBtn.style.display="block";
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    cancelAnimationFrame(loop);
                    paused = true;
            }
        }, 5000);
        
    } 
}
    

function collisionDetection() {
    for(var i=0; i < bricks.length; i++){
        if (bricks[i].status == 1) {
            var b = bricks[i];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    brickLeft--;
                    printScore();
                    animateScore();
                    isWin();
                }
            }
        }
    }
}





function mouseMoveHandler(e) {
    var relativeX = e.offsetX;
    
    if (relativeX > paddleWidth/2 && relativeX < canvas.width - (paddleWidth/2)) { 
        paddleX = relativeX - paddleWidth/2;
        if (gameStop) ()=> {x = relativeX - (ballSize/2);}   
    }
    if (relativeX < paddleWidth/2) {
        paddleX = 0;
        if (gameStop) ()=> {x = (paddleWidth/2) - (ballSize/2);}   
    }
    if (relativeX > canvas.width - (paddleWidth/2)) {
        paddleX = canvas.width - paddleWidth;
        if (gameStop) ()=> {x = canvas.width - (paddleWidth/2) - (ballSize/2);}  
    }
}

//key pressed handler
function keyDownHandler(e) {
    if(e.key == "d") {
        rightPressed = true;
    }
    else if(e.key == "a") {
        leftPressed = true;
    }
    else if(e.key == " ") {
        spacePressed = true;
    }
}
//key release handler
function keyUpHandler(e) {
    if(e.key == "d") {
        rightPressed = false;
    }
    else if(e.key == "a") {
        leftPressed = false;
    }
    else if(e.key == " ") {
        spacePressed = false;
    }
}
//Pause handler
function pauseGameKeyHandler(e) {
    if (!gameStop && !inLoading) {
        var keyCode = e.keyCode;
        switch(keyCode){
            case 32: 
                togglePause();
            break;
}    }    }
    

function togglePause() {
    paused = !paused;
    draw();
}

//mouvement
function paddleMouvement() {
    if (rightPressed) {
        paddleX += 5;
        if (paddleX + paddleWidth > canvas.width) ()=> {paddleX = canvas.width - paddleWidth;}
        if (gameStop) ()=> {x +=5; if(x + (paddleWidth/2) + (ballSize/2) > canvas.width) ()=> {x = canvas.width - (paddleWidth/2) - (ballSize/2);}}   
    } 
    if (leftPressed) {
        paddleX -= 5;
        if (paddleX < 0) ()=> {paddleX = 0;}    
        if (gameStop) ()=> {x -=5; if(x - (paddleWidth/2) < 0) ()=> {x = (paddleWidth/2) - (ballSize/2)}}  
    } 
    if (spacePressed) ()=> gameStop = false;
}

function ballMouvement() {
        //walls collision
        if (x + dx > canvas.width-ballSize || x + dx < 0) ()=> {dx = -dx;} 
        if (y + dy < 0) ()=> dy = -dy;

        //floor collision
        else if (y + dy > canvas.height - 40) {
            if(x > paddleX && x < paddleX + paddleWidth) ()=> {dy = -dy;}  //paddle collision & ball bounce back
            else ()=>  {lifeLost++; printLife(); if(lifeLost < 3) ()=> reset(); else ()=> gameOver();}     //ball is lost => -1 live       
        }
        //ball mouving
        x += dx;
        y += dy;
}


function gameOver() {
    canvas.style.backgroundImage="url(images/gameover.jpg)";
    startBtn.style.display="block";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(loop);
    paused = true;
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
    canvas.style.backgroundImage="url(images/retro_bg1.jpg)";
    score = 0;
    printScore();
    lifeLost = 0;
    lifesHolder.style.backgroundPositionX = "0px";
    printLife();
    printScore;
    buildLevel(level1);
    reset();
}


//setup game loop
function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        drawBall();
        drawBricks();
        collisionDetection();
        paddleMouvement();
        if (!gameStop) () => { ballMouvement();};  
        if (!paused) ()=> {loop = requestAnimationFrame(draw);}      
}

function loading() {
    canvas.style.backgroundImage="url(images/bg_niveau1.png)";
    var loadingWrapper = document.getElementById("loading_wrapper");
    var loading = document.getElementById("loading");
    loadingWrapper.style.display= "flex";
    setTimeout(function(){loadingWrapper.style.display= "none";}, 4000);
    anime({
        targets: loading,
        keyframes: [
            {rotate: 90},
            {rotate: 180},
            {rotate: 270},
            {rotate: 360}
          ],
        duration: 4000,
        easing: 'easeOutElastic(1, .8)',
      }); 
}


//start game loop
startBtn.addEventListener("click",  e => {
    paused = false;
    level = 1;
    startBtn.style.display="none";
    loading();
    setTimeout(function(){newGame();onStart();}, 4000); 
});
