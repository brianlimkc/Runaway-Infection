let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let mouseClick = false;
let gameCounter = 0;

let ballValues = [
    blueBall = {
        ballName: "blue",
        ballCol: '#35b5ff',
        ballRad: 10,
        ballSpeed: 3,
        counter: 1,
        boomUpEnd: 1,
        boomDownStart: 1,
        boomUpSize: 0,
        boomDownSize: 0,
        chainMult: false,
        pointsValue: 100,
        chainRad: 0,
        boomed: false,
        faded: false
    },
    redBall = {
        ballName: "red",
        ballCol: '#ff479c',
        ballRad: 10,
        ballSpeed: 1,
        counter: 50,
        boomUpEnd: 25,
        boomDownStart: 25,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: false,
        pointsValue: 500,
        chainRad: 100,
        boomed: false,
        faded: false
    },
    orangeBall = {
        ballName: "orange",
        ballCol: 'orange',
        ballRad: 10,
        ballSpeed: 1,
        counter: 50,
        boomUpEnd: 25,
        boomDownStart: 25,
        boomUpSize: 0.5,
        boomDownSize: 0.5,
        chainMult: false,
        pointsValue: 200,
        chainRad: 100,
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
        chainMult: false,
        pointsValue: 1000,
        chainRad: 100,
        boomed: false,
        faded: false
    },
    playerShot = {
        ballName: "playerShot",
        ballCol: 'black',
        ballRad: 25,
        counter: 1,
        boomUpEnd: 1,
        boomDownStart: 1,
        boomUpSize: 0,
        boomDownSize: 0,
        chainMult: false,
        pointsValue: 0,
        chainRad: 0,
        boomed: false,
        faded: false
    }
]

let levelBallCount = [
    level1 = {
        blue: 10,
        red: 0,
        orange: 0,
        maxBlue: 50,
        maxRed: 20,
        maxOrange: 3
    }
]

let ballArray = fillBallArray(levelBallCount[0])
// console.log(ballArray)

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

    let ballX = Math.floor(Math.random() * (canvas.width-20)) + 10
    let ballY = Math.floor(Math.random() * (canvas.height-20)) + 10
    let ballAngle = Math.floor(Math.random() * 360)
    let ballSpeed = Math.floor(Math.random() * ballValueObj.ballSpeed) + ballValueObj.ballSpeed/2
    let ballDX = Math.cos(ballAngle) * ballSpeed
    let ballDY = Math.sin(ballAngle) * ballSpeed

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
    this.ballName = ballValueObj.ballName

    this.boomed = false
    this.faded = false
}

let boomBallsArray = []
let chainArray = []

//player cursor definition

let pCursor = {
    pX : canvas.width/2,
    pY : canvas.height/2,
    pCol : 'black',
    pRad : 25,
    pFill: false,
    pNotClicked: true,
    pCounter: 0,
    pfaded: false
}


// main function
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameCounter > 1200) {
        gameCounter === 1
    }

    gameCounter++

    replenishBalls(gameCounter)

    drawLine(ballArray)

    ballArray.forEach(function (ballObj) { // draw balls and move balls
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

    drawCursor(pCursor) // draws cursor

    // collision check

        if (mouseClick) {
            boomBallsArray.forEach(function(boomObj){
                let boomedFlag = false
                let playerShot = false

                if (boomObj.ballName === "playerShot") {
                    playerShot = true
                }

                if (!boomObj.faded) {
                    let boomX = boomObj.ballX
                    let boomY = boomObj.ballY
                    let boomRad = boomObj.ballRad

                    chainArray.forEach(function (chainObj) {
                        if (!chainObj.boomed) {
                            let aX = chainObj.ballX
                            let aY = chainObj.ballY
                            let aRad = chainObj.chainRad
                            if (playerShot) {
                                aRad = chainObj.ballRad
                            }


                            if (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                                chainObj.boomed = true
                                chainObj.ballRad = chainObj.chainRad - 5
                                boomBallsArray.push(chainObj)
                            }
                        }

                    })

                    ballArray.forEach(function (ballObj) {
                        if (!ballObj.boomed) {
                            let aX = ballObj.ballX
                            let aY = ballObj.ballY
                            let aRad = ballObj.ballRad
                            let orangeFlag = false
                            if (ballObj.ballName === 'orange') {
                                orangeFlag = true
                            }

                            if (playerShot && orangeFlag && (collideCheck(aX, aY, aRad, boomX, boomY, boomRad))) {
                                ballObj.ballName = "red"
                                ballObj.ballCol = '#ff479c'
                            } else if (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                                ballObj.boomed = true
                                boomBallsArray.push(ballObj)
                            }
                        }

                    })
                }

                // if (boomedFlag) {
                //     ballObj.boomed = true
                //     boomBallsArray.push(ballObj)
                // }

            })
        }

    // adjust boomball size and draw boomballs

    if (mouseClick) {
        boomBallsArray.forEach(function (boomObj) {
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


    if (boomBallsArray.length >= 1) {
        let boomLength = boomBallsArray.length - 1
        for (let i = boomLength; i >= 0; i--) {
            if (boomBallsArray[i].faded) {
                boomBallsArray.splice(i, 1)
                //console.log('removed faded')
            }
        }
    }

    if (ballArray.length >= 1) {
        let ballLength = ballArray.length - 1
        for (let i = ballLength; i >= 0; i--) {
            if (ballArray[i].boomed) {
                ballArray.splice(i, 1)
                //console.log('removed boomed')
            }
        }
    }

    // console.log(`BallArray length: ${ballArray.length} BoomArrayLength: ${boomBallsArray.length}`)
} // end of draw function



function drawBall(ballX, ballY, ballCol, ballRad) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRad, 0, Math.PI*2);
    ctx.fillStyle = ballCol;
    ctx.fill();
    ctx.closePath();
}

function drawCursor() {

        let pX = pCursor.pX
        let pY = pCursor.pY
        let pCol = pCursor.pCol
        let pRad = pCursor.pRad

        ctx.beginPath();
        ctx.arc(pX, pY, pRad, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = pCol;
        ctx.stroke();
        ctx.closePath();

}

function collideCheck(aX,aY,aRad,bX,bY,bRad){
    let sumRad = aRad + bRad
    let xDist = Math.abs(aX - bX)
    let yDist = Math.abs(aY - bY)
    return ((xDist*xDist+yDist*yDist)<=(sumRad*sumRad))
}

function drawLine(ballArrayTemp) {

    let detonateArray1 = []
    chainArray = []

    ballArrayTemp.forEach(function(obj){
        if (obj.ballName === 'red') {
            detonateArray1.push(obj)
            // let detonateObj = {}
            // detonateObj.ballX = obj.ballX
            // detonateObj.ballY = obj.ballY
            // detonateObj.ballRad = obj.ballRad
            // detonateObj.chainRad = obj.chainRad
            // detonateArray1.push(detonateObj)
        }
    })

    detonateArray1.forEach(function(obj1){
        let aX = obj1.ballX
        let aY = obj1.ballY
        let aRad = obj1.chainRad
        let chainFlag = false


        detonateArray1.forEach(function(obj2){
            let bX = obj2.ballX
            let bY = obj2.ballY
            let bRad = obj2.chainRad

            if (!((aX===bX)&&(aY===bY))) {
                if (collideCheck(aX, aY, aRad, bX, bY, bRad)) {
                    chainFlag = true
                    ctx.beginPath();
                    ctx.moveTo(aX, aY);
                    ctx.lineTo(bX, bY);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#ff479c';
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        })
        if (chainFlag) {
            obj1.chainMult = true
            chainArray.push(obj1)
                    }

    })
    //console.log(chainArray.length)

}

function replenishBalls(gameCounter) {

    let blueCount = 0
    let redCount = 0
    let orangeCount = 0
    let maxBlue = levelBallCount[0].maxBlue
    let maxRed = levelBallCount[0].maxRed
    let maxOrange = levelBallCount[0].maxOrange

    ballArray.forEach(function(obj){
        if (obj.ballName==='blue') {blueCount++}
        if (obj.ballName==='red') {redCount++}
        if (obj.ballName==='orange') {orangeCount++}
    })

    console.log(redCount+' '+maxRed)


    if (gameCounter%300===0) {
        if (redCount < maxRed) {
            let newBall = ballGenerator(ballValues[1])
            ballArray.push(newBall)
        }
    }

    if (gameCounter%50===0) {
        if (orangeCount < maxOrange) {
            let newBall = ballGenerator(ballValues[2])
            ballArray.push(newBall)
        }
    }

    if (gameCounter%20===0) {
        if (blueCount < maxBlue) {
            let newBall = ballGenerator(ballValues[0])
            ballArray.push(newBall)
        }
    }
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
    mouseClick = true;
    let playerShotObj = new BallConstructor(ballValues[4],pCursor.pX,pCursor.pY,0,0)
    boomBallsArray.push(playerShotObj)
    console.log(playerShotObj)
}


setInterval(draw, 10);

