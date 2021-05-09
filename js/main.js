let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let mouseClick = false;

let ballValues = [
    blueBall = {
        ballName: "blue",
        ballCol: '#35b5ff',
        ballRad: 10,
        ballSpeed: 4,
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
        ballCol: '#ff479c',
        ballRad: 10,
        ballSpeed: 1,
        counter: 100,
        boomUpEnd: 50,
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
        ballCol: '#fffb38',
        ballRad: 10,
        ballSpeed: 3,
        counter: 100,
        boomUpEnd: 50,
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
    let ballSpeed = Math.floor(Math.random() * ballValueObj.ballSpeed * 1.2) + 2
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
    this.ballName = ballValueObj.ballName

    this.boomed = false
    this.faded = false
}

let boomBallsArray = []

//player cursor definition

let pCursor = {
    pX : canvas.width/2,
    pY : canvas.height/2,
    pCol : 'black',
    pRad : 50,
    pFill: false,
    pNotClicked: true,
    pCounter: 0,
    pfaded: false
}


// main function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLine(ballArray)

    ballArray.forEach(function (ballObj) {
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
        ballArray.forEach(function (ballObj) {
            if (!ballObj.boomed) {
                let aX = ballObj.ballX
                let aY = ballObj.ballY
                let aRad = ballObj.ballRad + ballObj.chainRad
                let boomedFlag = false
                let chainLink = false

                boomBallsArray.forEach(function (boomObj) {
                    if (!boomObj.faded) {
                        let boomX = boomObj.ballX
                        let boomY = boomObj.ballY
                        let boomRad = boomObj.ballRad + boomObj.chainRad

                        if (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                            boomedFlag = true
                        }
                    }
                })

                if (boomedFlag) {
                    ballObj.boomed = true
                    boomBallsArray.push(ballObj)
                }
            }
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

function drawLine(ballArray) {

    let detonateArray1 = []
    let detonateArray2 = []

    ballArray.forEach(function(obj){
        if (obj.ballName === 'red') {
            let detonateObj = {}
            detonateObj.ballX = obj.ballX
            detonateObj.ballY = obj.ballY
            detonateObj.ballRad = obj.ballRad
            detonateObj.chainRad = obj.chainRad
            detonateArray1.push(detonateObj)
        }
    })

    ballArray.forEach(function(obj){
        if (obj.ballName === 'orange') {
            let detonateObj2 = {}
            detonateObj2.ballX = obj.ballX
            detonateObj2.ballY = obj.ballY
            detonateObj2.ballRad = obj.ballRad
            detonateObj2.chainRad = obj.chainRad
            detonateArray2.push(detonateObj2)
        }
    })



    //
    // let redArray = ballArray.filter(obj => obj.ballName === 'red')
    // let orangeArray = ballArray.filter(obj => obj.ballName === 'orange')
    //
    // detonateArray1 = [...redArray,...orangeArray]
    // detonateArray2 = [...redArray,...orangeArray]

    // console.log(detonateArray1)
    //

    detonateArray1.forEach(function(obj1){
        detonateArray2.forEach(function(obj2){
            let aX = obj1.ballX
            let aY = obj1.ballY
            let aRad = obj1.ballRad+obj1.chainRad

            let bX = obj2.ballX
            let bY = obj2.ballY
            let bRad = obj2.ballRad+obj2.chainRad

            if (collideCheck(aX, aY, aRad, bX, bY, bRad)){
                ctx.beginPath();
                ctx.moveTo(aX,aY);
                ctx.lineTo(bX,bY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff479c';
                ctx.stroke();
                ctx.closePath();
            }
        })
    })

    // detonateArray2.forEach(function(obj1){
    //     detonateArray1.forEach(function(obj2){
    //         let aX = obj1.ballX
    //         let aY = obj1.ballY
    //         let aRad = obj1.ballRad+obj1.chainRad
    //
    //         let bX = obj2.ballX
    //         let bY = obj2.ballY
    //         let bRad = obj2.ballRad+obj2.chainRad
    //
    //         if (collideCheck(aX, aY, aRad, bX, bY, bRad)){
    //             ctx.beginPath();
    //             ctx.moveTo(aX,aY);
    //             ctx.lineTo(bX,bY);
    //             ctx.lineWidth = 2;
    //             ctx.strokeStyle = '#fffb38';
    //             ctx.stroke();
    //             ctx.closePath();
    //         }
    //     })
    // })
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
}


setInterval(draw, 16.67);

