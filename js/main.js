let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let mouseClick = false;

let ballValues = [
    blueBall = {
        ballName: "blue",
        ballCol: 'blue',
        ballRad: 10,
        ballSpeed: 3,
        counter: 50,
        boomUpEnd: 25,
        boomDownStart: 25,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: 0,
        pointsValue: 100,
        chainRad: 0,
        boomed: false,
        faded: false
    },
    redBall = {
        ballName: "red",
        ballCol: 'red',
        ballRad: 10,
        ballSpeed: 1,
        counter: 200,
        boomUpEnd: 150,
        boomDownStart: 50,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: 2,
        pointsValue: 500,
        chainRad: 100,
        boomed: false,
        faded: false
    },
    orangeBall = {
        ballName: "orange",
        ballCol: 'orange',
        ballRad: 10,
        ballSpeed: 2,
        counter: 200,
        boomUpEnd: 150,
        boomDownStart: 50,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: 2,
        pointsValue: 200,
        chainRad: 0,
        boomed: false,
        faded: false
    },
    node = {
        ballName: "node",
        ballCol: 'orangered',
        ballRad: 10,
        counter: 400,
        boomUpEnd: 30,
        boomDownStart: 100,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: 2,
        pointsValue: 1000,
        chainRad: 100,
        boomed: false,
        faded: false
    },
    playerShot = {
        ballName: "playerShot",
        ballCol: 'black',
        ballRad: 25,
        counter: 50,
        boomUpEnd: 25,
        boomDownStart: 25,
        boomUpSize: 1,
        boomDownSize: 1,
        chainMult: 0,
        pointsValue: 0,
        chainRad: 0,
        boomed: false,
        faded: false
    }
]

let levelBallCount = [
    level1 = {
        blue: 30,
        red: 10,
        orange: 10
    }
]

let ballArray = fillBallArray(levelBallCount[0])

console.log(ballArray)

function fillBallArray(ballCountObj){
    let ballArray = []
    let blueCount = ballCountObj.blue
    let redCount = ballCountObj.red
    let orangeCount = ballCountObj.orange

    for (let i = 0; i < blueCount; i++) {
        let newBall = ballGenerator(ballValues[0])
        ballArray.push(newBall)
    }
    for (let i = 0; i < redCount; i++) {
        let newBall = ballGenerator(ballValues[1])
        ballArray.push(newBall)
    }
    for (let i = 0; i < orangeCount; i++) {
        let newBall = ballGenerator(ballValues[2])
        ballArray.push(newBall)
    }

    return ballArray
}

function ballGenerator(ballValueObj){

    let ballX = Math.floor(Math.random() * 700) + 10
    let ballY = Math.floor(Math.random() * 700) + 10
    let ballAngle = Math.floor(Math.random() * 360)
    let ballSpeed = Math.floor(Math.random() * ballValueObj.ballSpeed) + 2
    let ballDX = Math.cos(ballAngle) * ballSpeed + 0.2
    let ballDY = Math.sin(ballAngle) * ballSpeed + 0.2

    newBall = new BallConstructor(ballValueObj, ballX, ballY, ballDX, ballDY)
    return newBall
}

function BallConstructor(ballValueObj, x, y, dx, dy) {
    this.ballX = x
    this.ballY = y
    this.ballDX = dx
    this.ballDY = dy

    this.ballCol = ballValueObj.ballCol
    this.ballRad = ballValueObj.ballRad
    this.counter = ballValueObj.counter
    this.boomUpEnd = ballValueObj.boomUpEnd
    this.boomDownStart = ballValueObj.boomDownStart
    this.boomUpSize = ballValueObj.boomUpSize
    this.boomDownSize = ballValueObj.boomDownSize
    this.chainMult = ballValueObj.chainMult
    this.pointsValue = ballValueObj.pointsValue
    this.chainRad = ballValueObj.chainRad

    this.boomed = false
    this.faded = false
}

let boomBallsArray = []

//player cursor definition

let pCursor = {
    pX : canvas.width/2,
    pY : canvas.height/2,
    pCol : 'black',
    pRad : 70,
    pFill: false,
    pNotClicked: true,
    pCounter: 0,
    pfaded: false
}


// main function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ballArray.forEach(function (ballObj){
        if (!ballObj.boomed) {

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
    if (mouseClick) {
        ballArray.forEach(function(ballObj){
            if (!ballObj.boomed) {
                let aX = ballObj.ballX
                let aY = ballObj.ballY
                let aRad = ballObj.ballRad

                let bX = pCursor.pX
                let bY = pCursor.pY
                let bRad = pCursor.pRad

                let boomedFlag = false

                if (!(pCursor.pfaded) && (collideCheck(aX, aY, aRad, bX, bY, bRad))) {
                    boomedFlag = true
                }

                boomBallsArray.forEach(function (boomObj){
                    if (!boomObj.faded) {
                        let boomX = boomObj.ballX
                        let boomY = boomObj.ballY
                        let boomRad = boomObj.ballRad

                        if (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                            boomedFlag = true
                        }
                    }
                })

                if (boomedFlag){
                    ballObj.boomed = true
                    boomBallsArray.push(ballObj)
                }
            }
        })
    }

    // adjust boomball size and draw boomballs

    if (mouseClick) {
        boomBallsArray.forEach(function(boomObj){
            if (!boomObj.faded) {

                boomObj.counter -= 1
                let boomCount = boomObj.counter

                if (boomCount <= 0) {
                    boomObj.ballRad = 0
                    boomObj.faded = true
                } else if (boomCount <= boomObj.boomDownStart) {
                    boomObj.ballRad -= boomObj.boomDownSize
                } else if (boomCount >= boomObj.boomUpEnd) {
                    boomObj.ballRad += boomObj.boomUpSize
                }

                let ballX = boomObj.ballX
                let ballY = boomObj.ballY
                let ballCol = boomObj.ballCol
                let ballRad = boomObj.ballRad

                drawBall(ballX, ballY, ballCol, ballRad);
            }
        })
    }

    let boomLength = boomBallsArray.length

    for (let i = boomLength; i < 0; i--) {
          if (boomBallsArray[i].faded) {
              boomBallsArray.splice(i,1)
          }
    }

    let ballLength = ballArray.length

    for (let i = ballLength; i < 0; i--) {
        if (ballArray[i].boomed) {
                  ballArray.splice(i,1)
              }
    }

    // ballArray.forEach(function(ballObj,id){
    //   if (ballObj.boomed) {
    //       ballArray.splice(id,1)
    //   }
    // })
    //
    // boomBallsArray.forEach(function(boomObj, id){
    //   if (boomObj.faded) {
    //       boomBallsArray.splice(id,1)
    //   }
    //
    // })

}

function drawBall(ballX, ballY, ballCol, ballRad) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRad, 0, Math.PI*2);
    ctx.fillStyle = ballCol;
    ctx.fill();
    ctx.closePath();
}

function drawCursor() {

    if (!(pCursor.pNotClicked)) {
        pCursor.pCounter += 1
        let boomCount = pCursor.pCounter

        if (boomCount >= 100) {
            pCursor.pRad = 0
            pCursor.pfaded = true
            } else if ((boomCount > 30) && (boomCount < 100)) {
                pCursor.pRad -= 1
            }
        }


        let pX = pCursor.pX
        let pY = pCursor.pY
        let pCol = pCursor.pCol
        let pRad = pCursor.pRad

        ctx.beginPath();
        ctx.arc(pX, pY, pRad, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = pCol;
        ctx.stroke();
        if (pCursor.pFill) {
            ctx.fillStyle = pCol;
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

// Event listeners


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


setInterval(draw, 16.67);

