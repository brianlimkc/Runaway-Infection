let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let mouseClick = false;
let numBalls = 10

let ballArray = fillBallArray(numBalls)
let boomBallsArray = []

//player cursor definition

let pCursor = {
    pX : canvas.width/2,
    pY : canvas.height/2,
    pCol : 'black',
    pRad : 70,
    pFill: false,
    pNotClicked: true,
    pCounter: 0
}


function fillBallArray(count){
    let ballArray = []
    for (let i = 0; i < count; i++) {
        let newBall = ballGenerator()
        ballArray.push(newBall)
    }
    return ballArray
}

function ballGenerator(){
    let colorArray = ['red','green','blue','orange','purple','brown']
    let ballAngle = Math.floor(Math.random() * 360)
    let ballSpeed = Math.floor(Math.random() * 3) +2

    let ballX = Math.floor(Math.random() * 700) + 10
    let ballY = Math.floor(Math.random() * 460) + 10
    let ballCol = colorArray[Math.floor(Math.random() * 6)]
    let ballDX = Math.cos(ballAngle) * ballSpeed + 0.2
    let ballDY = Math.sin(ballAngle) * ballSpeed + 0.2
    let ballRad = 10

    newBall = new BallConstructor(ballX, ballY, ballCol, ballDX, ballDY, ballRad)
    return newBall
}

function BallConstructor(x, y, col, dx, dy, rad){
    this.ballX = x
    this.ballY = y
    this.ballCol = col
    this.ballDX = dx
    this.ballDY = dy
    this.ballRad = rad
    this.counter = 0
    this.notBoomed = true
    this.notFaded = true
}

// main function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ballArray.forEach(function (ballObj){
        if (ballObj.notBoomed) {

            let ballX = ballObj.ballX
            let ballY = ballObj.ballY
            let ballCol = ballObj.ballCol
            let ballDX = ballObj.ballDX
            let ballDY = ballObj.ballDY
            let ballRad = ballObj.ballRad

            drawBall(ballX, ballY, ballCol, ballRad);

            if (ballX + ballDX > canvas.width - ballRad || ballX + ballDX < ballRad) {
                ballObj.ballDX = -ballDX;
            }

            if (ballY + ballDY > canvas.height - ballRad || ballY + ballDY < ballRad) {
                ballObj.ballDY = -ballDY;
            }

            ballObj.ballX += ballObj.ballDX;
            ballObj.ballY += ballObj.ballDY;
        }
        })

    drawCursor(pCursor)


    // collision check
    ballArray.forEach(function(ballObj){
        if (ballObj.notBoomed) {
            let aX = ballObj.ballX
            let aY = ballObj.ballY
            let aRad = ballObj.ballRad

            let bX = pCursor.pX
            let bY = pCursor.pY
            let bRad = pCursor.pRad

            if (mouseClick) {
                if (collideCheck(aX, aY, aRad, bX, bY, bRad)) {
                    ballObj.notBoomed = true
                    boomBallsArray.push(ballObj)
                }

                boomBallsArray.forEach(function (boomObj){
                    if (!boomObj.faded) {
                        let bX = boomObj.ballX
                        let bY = boomObj.ballY
                        let bRad = boomObj.ballRad

                        if (collideCheck(aX, aY, aRad, bX, bY, bRad)) {
                            ballObj.notBoomed = false
                            boomBallsArray.push(ballObj)
                        }
                    }
                })
            }
        }
    })



    //adjust boomball size and draw boomballs
    if (mouseClick) {
        boomBallsArray.forEach(function(boomObj){

            if (boomObj.notFaded) {

                boomObj.counter += 1
                let boomCount = boomObj.counter
                if (boomCount >= 400) {
                    boomObj.notFaded = false
                } else if (boomCount < 100) {
                    boomObj.ballRad += 1
                } else if ((boomCount >= 300) && (boomCount < 400)) {
                    boomObj.ballRad -= 1
                }

                let ballX = boomObj.ballX
                let ballY = boomObj.ballY
                let ballCol = boomObj.ballCol
                let ballRad = boomObj.ballRad

                drawBall(ballX, ballY, ballCol, ballRad);
            }
        })
    }



}

function drawBall(ballX, ballY, ballCol, ballRad) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRad, 0, Math.PI*2);
    ctx.fillStyle = ballCol;
    ctx.fill();
    ctx.closePath();
}

function drawCursor(){

    if (!(pCursor.pNotClicked)) {
        pCursor.pCounter += 1
        let boomCount = pCursor.pCounter
        if (boomCount >= 200) {
            pCursor.pRad = 0
        } else if ((boomCount >= 100) && (boomCount < 200)) {
            pCursor.pRad -= 1
        }
    }

    let pX = pCursor.pX
    let pY = pCursor.pY
    let pCol = pCursor.pCol
    let pRad = pCursor.pRad

    ctx.beginPath();
    ctx.arc(pX, pY, pRad, 0, Math.PI*2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = pCol;
    ctx.stroke();
    if (pCursor.pFill) {
        ctx.fillStyle= pCol;
        ctx.fill();
    }

    ctx.closePath();
}

function collideCheck(aX,aY,aRad,bX,bY,bRad){
    let sumRad = aRad + bRad
    let xDist = Math.abs(aX - bX)
    let yDist = Math.abs(aY - bY)
    return ((xDist*xDist+yDist*yDist)<=(sumRad*sumRad))
}


document.addEventListener("mousemove", mouseMoveHandler, false);

document.addEventListener("mousedown", mouseClickHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        pCursor.pX = relativeX //- pCursor.pRad;
    }
    let relativeY = e.clientY - canvas.offsetTop;
    if(relativeY > 0 && relativeY < canvas.width) {
        pCursor.pY = relativeY //- pCursor.pRad;
    }
}

function mouseClickHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler, false);
    mouseClick = true;
    pCursor.pFill = true;
    pCursor.pNotClicked = false;
}


setInterval(draw, 10);
