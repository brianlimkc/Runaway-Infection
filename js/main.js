let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let gameTime = 0
let gameInterval = 16.67
let gameTick = Math.round(1000/gameInterval)
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
let mouseClick = false;
let gameCounter = 0;
let gameScore = 0;
let levelScore = 0;
let blueCount = 0;
let redCount = 0;
let orangeCount = 0;
let importRate = 0;
let spreadRate = 0;
let isBallSlow = false;

// ctx.font = "20px Georgia"; // font

let chainCount = 0; // chain counter

let boomBallsArray = []
let chainArray = []

let ballValues = [
    blueBall = {
        ballName: "blue",
        ballCol: '#35b5ff',
        ballRad: 10,
        ballSpeed: 1,
        counter: 12,
        boomUpEnd: 6,
        boomDownStart: 6,
        boomUpSize: 1,
        boomDownSize: 1,
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
        counter: 12, // 50
        boomUpEnd: 6, //25
        boomDownStart: 6, //25
        boomUpSize: 0.1,
        boomDownSize: 0.1,
        chainMult: false,
        pointsValue: 500,
        chainRad: 80,  // to change back to 100
        boomed: false,
        faded: false
    },
    orangeBall = {
        ballName: "orange",
        ballCol: 'orange',
        ballRad: 10,
        ballSpeed: 1,
        counter: 12,
        boomUpEnd: 6,
        boomDownStart: 6,
        boomUpSize: 0.1,
        boomDownSize: 0.1,
        chainMult: false,
        pointsValue: 200,
        chainRad: 80,
        boomed: false,
        faded: false
    },
    monster = {
        ballName: "monster",
        ballCol: 'purple',
        ballRad: 10,
        counter: 1,
        ballSpeed: 1.5,
        boomUpEnd: 1,
        boomDownStart: 1,
        boomUpSize: 0,
        boomDownSize: 0,
        chainMult: false,
        pointsValue: 1000,
        chainRad: 0,
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

let levelCount = 0

let levelInitValues = [
    level1 = {
        blue: 10, // 10
        red: 1, // 1
        orange: 0,
        maxBlue: 40, //20
        maxRed: 7, //15
        maxOrange: 0,
        maxMonster: 5, // 0
        levelTime: 2000,  // 2000
        blueSpawn: 20,
        redSpawn: 20, // 50
        orangeSpawn: 2001,
        monsterSpawn: 400, //2001
        monsterGrow: 1,
        importRate: 200,
        spreadRate: 3,
        levelDesc: "Covid-19 is spreading rapidly through the population!" +
            "Click on the red balls when they are linked to set off" +
            " big explosions which will help cure the disease!"
    },
    level2 = {
        blue: 20,
        red: 1,
        orange: 1,
        maxBlue: 60,
        maxRed: 10,
        maxOrange: 3,
        maxMonster: 0,
        levelTime: 2500,
        blueSpawn: 30,
        redSpawn: 100,
        orangeSpawn: 30,
        monsterSpawn: 2001,
        monsterGrow: 0,
        importRate: 200,
        spreadRate: 3,
        levelDesc: "Click on orange balls to turn them into red balls. " +
            "This will allow you to make huge chains to quickly cure more people!"
    },
    level3 = {
        blue: 20,
        red: 3,
        orange: 3,
        maxBlue: 80,
        maxRed: 50,
        maxOrange: 3,
        maxMonster: 1,
        levelTime: 2500,
        blueSpawn: 10,
        redSpawn: 100,
        orangeSpawn: 30,
        monsterSpawn: 400,
        monsterGrow: 0.05,
        importRate: 100,
        spreadRate: 5,
        levelDesc: "The disease is mutating and is spreading faster and faster."  +
            "More and more cases are also appearing at random. " +
            "Perhaps it is time to implement some control measures?"
    },
    level4 = {
        blue: 30,
        red: 1,
        orange: 1,
        maxBlue: 100,
        maxRed: 5,
        maxOrange: 3,
        maxMonster: 3,
        levelTime: 2500,
        blueSpawn: 30,
        redSpawn: 200,
        orangeSpawn: 50,
        monsterSpawn: 300,
        monsterGrow: 0.15,
        importRate: 70,
        spreadRate: 7,
        levelDesc: "This hard level has more of everything. Think you can survive?"
    },
    level5 = {
        blue: 40,
        red: 1,
        orange: 1,
        maxBlue: 120,
        maxRed: 20,
        maxOrange: 3,
        maxMonster: 5,
        levelTime: 3000,
        blueSpawn: 30,
        redSpawn: 250,
        orangeSpawn: 50,
        monsterSpawn: 200,
        monsterGrow: 0.25,
        importRate: 30,
        spreadRate: 9,
        levelDesc: "This is the nightmare difficulty level. " +
            "Challenge it if you dare!"
    }
]

function fillBallArray(ballCountObj){
    let ballArray = []
    let blueCount = ballCountObj.blue
    let redCount = ballCountObj.red
    let orangeCount = ballCountObj.orange

    for (let i = 0; i < blueCount; i++) {
        let newBall = ballGenerator(ballValues[0])
        if (i===0) {
            ballArray.push(newBall)
        } else {
            ballArray.forEach(function(obj){
                newBall = ballGenerator(ballValues[0])

                let aX = obj.ballX
                let aY = obj.ballY
                let aRad = obj.ballRad
                let bX = newBall.ballX
                let bY = newBall.ballY
                let bRad = newBall.ballRad

                while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                    newBall = ballGenerator(ballValues[0])
                    bX = newBall.ballX
                    bY = newBall.ballY
                    bRad = newBall.ballRad
                }
            })
        }
        ballArray.push(newBall)
    }
    for (let i = 0; i < redCount; i++) {
        let newBall = ballGenerator(ballValues[1])
        ballArray.forEach(function(obj){

            let aX = obj.ballX
            let aY = obj.ballY
            let aRad = obj.ballRad
            let bX = newBall.ballX
            let bY = newBall.ballY
            let bRad = newBall.ballRad

            while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                newBall = ballGenerator(ballValues[1])
                bX = newBall.ballX
                bY = newBall.ballY
                bRad = newBall.ballRad
            }
        })
        ballArray.push(newBall)
    }
    for (let i = 0; i < orangeCount; i++) {
        let newBall = ballGenerator(ballValues[2])

        ballArray.forEach(function(obj){

            let aX = obj.ballX
            let aY = obj.ballY
            let aRad = obj.ballRad
            let bX = newBall.ballX
            let bY = newBall.ballY
            let bRad = newBall.ballRad

            while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                newBall = ballGenerator(ballValues[2])
                bX = newBall.ballX
                bY = newBall.ballY
                bRad = newBall.ballRad
            }
        })
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
    this.isBounced = false
}

function ballDrawMove(ballArray) {

    ballArray.forEach(function (ballObj) {
        if (!ballObj.boomed) {

            let ballX = ballObj.ballX
            let ballY = ballObj.ballY
            let ballCol = ballObj.ballCol
            let ballDX = ballObj.ballDX
            let ballDY = ballObj.ballDY
            let ballRad = ballObj.ballRad

            if ((ballDX*ballDX+ballDY*ballDY)>8)  {
                ballDX *= 0.6
                ballDY *= 0.6
                //console.log('slowdown' + ballDX + ' ' + ballDY)
            }

            if (isBallSlow) {

                if ((ballDX * ballDX + ballDY * ballDY) > 0.25) {
                    ballDX *= 0.6
                    ballDY *= 0.6
                    //console.log('slowdown' + ballDX + ' ' + ballDY)
                }
            } else {
                ballDX *= 1.1
                ballDY *= 1.1
            }


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
}

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

function randomInfection(bounceBallArray) {
    let infectSelection = Math.floor(Math.random()*bounceBallArray.length)
    infectBall(bounceBallArray[infectSelection])
}

function infectBall(ballObj) {
    ballObj.ballName = 'covid'
    ballObj.ballCol = '#008A09'
}

function cureBall(ballObj) {
    ballObj.ballName = 'blue'
    ballObj.ballCol = '#35b5ff'
}

function turnRed(ballObj) {
    ballObj.ballName = "red"
    ballObj.ballCol = '#ff479c'
    ballObj.pointsValue = 500
}

function bounceResolver(ballArray) {

    let bounceBallArray = []

    ballArray.forEach(function (obj1){
        if (obj1.ballName !== "monster") {
            obj1.isBounced = false
            bounceBallArray.push(obj1)
        }
    })

    if (gameCounter%importRate===0) {
        randomInfection(bounceBallArray)
    }

    bounceBallArray.forEach(function (obj1){
        if (!obj1.isBounced) {
            let aX = obj1.ballX
            let aY = obj1.ballY
            let aDX = obj1.ballDX
            let aDY = obj1.ballDY
            let aRad = obj1.ballRad
            bounceBallArray.forEach(function (obj2) {
                if (!obj2.isBounced) {
                    let bX = obj2.ballX
                    let bY = obj2.ballY

                    if (!((aX === bX) && (aY === bY))) {
                        let bDX = obj2.ballDX
                        let bDY = obj2.ballDY
                        let bRad = obj2.ballRad

                        // console.log(collideCheck(aX,aY,aRad,bX,bY,bRad))

                        let sumRad = aRad + bRad
                        let xDist = Math.abs(aX - bX)
                        let yDist = Math.abs(aY - bY)

                        if ((xDist*xDist+yDist*yDist)-(sumRad*sumRad)<0) {

                            // console.log(collideCheck(aX,aY,aRad,bX,bY,bRad))

                            let x = aX - bX
                            let y = aY - bY
                            let d = x * x + y * y

                            let u1 = (aDX * x + aDY * y) / d
                            let u2 = (x * aDY - y * aDX) / d
                            let u3 = (bDX * x + bDY * y) / d
                            let u4 = (x * bDY - y * bDX) / d

                            obj2.ballDX = x * u1 - y * u4
                            obj2.ballDY = y * u1 + x * u4
                            obj1.ballDX = x * u3 - y * u2
                            obj1.ballDY = y * u3 + x * u2

                            obj1.isBounced = true
                            obj2.isBounced = true

                            let collAngle = Math.atan(yDist/xDist)
                            let yShift = ((Math.sin(collAngle) * (sumRad)) - yDist) * 0.5
                            let xShift = ((Math.cos(collAngle) * (sumRad)) - xDist) * 0.5

                            // console.log(`xshift: ${xShift} yshift: ${yShift}`)

                            if (aX <= bX) {
                                obj1.ballX-=xShift
                                obj2.ballX+=xShift
                            } else {
                                obj1.ballX+=xShift
                                obj2.ballX-=xShift
                            }

                            if (aY <= bY) {
                                obj1.ballY-=yShift
                                obj2.ballY+=yShift
                            } else {
                                obj1.ballY+=yShift
                                obj2.ballY-=yShift
                            }


                            let isBall1Infected = (obj1.ballName === 'covid')
                            let isBall2Infected = (obj2.ballName === 'covid')
                            let isBall1Blue = (obj1.ballName === 'blue')
                            let isBall2Blue = (obj2.ballName === 'blue')


                            if (isBall1Infected && !isBall2Infected && isBall2Blue) {
                                if ((Math.floor(Math.random() * 10)) <= spreadRate) {
                                    infectBall(obj2)
                                    console.log('infection 1 to 2')
                                }
                            } else if (!isBall1Infected && isBall2Infected && isBall1Blue) {
                                if ((Math.floor(Math.random() * 10)) <= spreadRate) {
                                    infectBall(obj1)
                                    console.log('infection 2 to 1')
                                }
                            }
                        }
                    }
                }
            })
        }
    })

}

function drawLine(ballArrayTemp) {

    let lineCheckArray = []
    chainArray = []

    ballArrayTemp.forEach(function(obj){
        if (obj.ballName === 'red') {
            lineCheckArray.push(obj)
        }
    })

    lineCheckArray.forEach(function(obj1){
        let aX = obj1.ballX
        let aY = obj1.ballY
        let aRad = obj1.chainRad

        lineCheckArray.forEach(function(obj2){
            let bX = obj2.ballX
            let bY = obj2.ballY
            let bRad = obj2.chainRad

            if (!((aX===bX)&&(aY===bY))) {
                if (collideCheck(aX, aY, aRad, bX, bY, bRad)) {
                    ctx.beginPath();
                    ctx.moveTo(aX, aY);
                    ctx.lineTo(bX, bY);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#ff479c';
                    ctx.stroke();
                    ctx.closePath();
                    obj1.chainMult = true
                    chainArray.push(obj1)
                    obj2.chainMult = true
                    chainArray.push(obj2)
                 }
            }
        })
    })
    // console.log(chainArray.length)

}

function collisionHandler(ballArray) {

    let arraySilence = true

    if (mouseClick) {
        boomBallsArray.forEach(function (boomObj) {
            let isPlayerShot = (boomObj.ballName === "playerShot")
            let isBlue = (boomObj.ballName === 'blue')
            let isCovid = (boomObj.ballName === 'covid')

            if (!boomObj.faded && (!isBlue || !isCovid)) {
                let boomX = boomObj.ballX
                let boomY = boomObj.ballY
                let boomRad = boomObj.ballRad

                chainArray.forEach(function (chainObj) {
                    if (!chainObj.boomed) {
                        let aX = chainObj.ballX
                        let aY = chainObj.ballY
                        let aRad = chainObj.chainRad
                        if (isPlayerShot) {
                            aRad = chainObj.ballRad

                        }
                        if (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                            arraySilence = false
                            chainCount++
                            console.log(chainCount)
                            chainObj.boomed = true
                            chainObj.ballRad = chainObj.chainRad * (1 + (0.1 * chainCount))
                            levelScore+=chainObj.pointsValue*2 * (1 + (0.1 * chainCount))
                            ctx.fillText(chainCount, aX, aY);
                            // $chainCount.innerHTML = chainCount
                            boomBallsArray.push(chainObj)
                        }
                    }

                })

                ballArray.forEach(function (ballObj) {

                    if (!ballObj.boomed) {
                        let aX = ballObj.ballX
                        let aY = ballObj.ballY
                        let aRad = ballObj.ballRad
                        let isBlue = (ballObj.ballName === 'blue')
                        let isCovid = (ballObj.ballName === 'covid')
                        let isOrange = (ballObj.ballName === 'orange')
                        let isMonster = (ballObj.ballName === 'monster')

                        if (ballObj.chainMult && !playerShot) {
                            aRad = ballObj.chainRad
                        }

                        if (isPlayerShot && isOrange && (collideCheck(aX, aY, aRad, boomX, boomY, boomRad))) {
                            turnRed(ballObj)
                        } else if (isPlayerShot && isMonster && (collideCheck(aX, aY, aRad, boomX, boomY, boomRad))) {
                            if (ballObj.ballRad <= 10) {
                                ballObj.boomed = true
                                boomBallsArray.push(ballObj)
                            } else {
                                ballObj.ballRad -= 10
                            }
                        } else if (isCovid && (collideCheck(aX, aY, aRad, boomX, boomY, boomRad)))  {
                            cureBall(ballObj)
                        } else if (!isBlue && collideCheck(aX, aY, aRad, boomX, boomY, boomRad)) {
                            ballObj.boomed = true
                            levelScore+=ballObj.pointsValue

                            if (ballObj.chainMult) {
                                ballObj.ballRad = ballObj.chainRad
                            }

                            boomBallsArray.push(ballObj)
                        }
                    }

                })
            }
        })

    }

    if (!arraySilence){
        chainCount = 0
        console.log('reset')
    }


}

function replenishBalls(gameCounter) {

    let blueCount = 0
    let covidCount = 0
    let redCount = 0
    let orangeCount = 0
    let monsterCount = 0
    let maxBlue = levelInitValues[levelCount].maxBlue
    let maxRed = levelInitValues[levelCount].maxRed
    let maxOrange = levelInitValues[levelCount].maxOrange
    let maxMonster = levelInitValues[levelCount].maxMonster
    let blueSpawn = levelInitValues[levelCount].blueSpawn
    let redSpawn = levelInitValues[levelCount].redSpawn
    let orangeSpawn = levelInitValues[levelCount].orangeSpawn
    let monsterSpawn = levelInitValues[levelCount].monsterSpawn

    ballArray.forEach(function(obj){
        if (obj.ballName==='blue') {blueCount++}
        if (obj.ballName==='covid') {covidCount++}
        if (obj.ballName==='red') {redCount++}
        if (obj.ballName==='orange') {orangeCount++}
        if (obj.ballName==='monster') {monsterCount++}
    })

    let infectedPct = ((covidCount/(covidCount+blueCount))*100).toFixed(1)

    $infectedBar.style.width = `${infectedPct * 7.2}px`
    $cleanBar.style.width =  `${(100-infectedPct) * 7.2}px`
    $infectedPct.innerHTML = `${infectedPct}% infected`

    // console.log(`blue: ${blueCount} red: ${redCount} orange: ${orangeCount} monster: ${monsterCount}`)

    if (gameCounter%redSpawn===0) {
        if (redCount < maxRed) {
            let newBall = ballGenerator(ballValues[1])
            ballArray.forEach(function(obj){
                let aX = obj.ballX
                let aY = obj.ballY
                let aRad = obj.ballRad
                let bX = newBall.ballX
                let bY = newBall.ballY
                let bRad = newBall.ballRad

                while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                    newBall = ballGenerator(ballValues[1])
                    bX = newBall.ballX
                    bY = newBall.ballY
                    bRad = newBall.ballRad
                }
            })
            ballArray.push(newBall)
        }
    }

    if (gameCounter%orangeSpawn===0) {
        if (orangeCount < maxOrange) {
            let newBall = ballGenerator(ballValues[2])
            ballArray.forEach(function(obj){

                let aX = obj.ballX
                let aY = obj.ballY
                let aRad = obj.ballRad
                let bX = newBall.ballX
                let bY = newBall.ballY
                let bRad = newBall.ballRad

                while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                    newBall = ballGenerator(ballValues[2])
                    bX = newBall.ballX
                    bY = newBall.ballY
                    bRad = newBall.ballRad
                }
            })
            ballArray.push(newBall)
        }
    }

    if (gameCounter%blueSpawn===0) {
        if ((blueCount+covidCount) < maxBlue) {
            let newBall = ballGenerator(ballValues[0])
            ballArray.forEach(function(obj){
                let aX = obj.ballX
                let aY = obj.ballY
                let aRad = obj.ballRad
                let bX = newBall.ballX
                let bY = newBall.ballY
                let bRad = newBall.ballRad

                while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                    newBall = ballGenerator(ballValues[0])
                    bX = newBall.ballX
                    bY = newBall.ballY
                    bRad = newBall.ballRad
                }
            })

            if (Math.floor(Math.random()*10)<1) {
                infectBall(newBall)
            }

            ballArray.push(newBall)
        }
    }

    if (gameCounter%monsterSpawn===0) {
        if (monsterCount < maxMonster) {
            let newBall = ballGenerator(ballValues[0])
            ballArray.forEach(function(obj){
                let aX = obj.ballX
                let aY = obj.ballY
                let aRad = obj.ballRad
                let bX = newBall.ballX
                let bY = newBall.ballY
                let bRad = newBall.ballRad

                while (collideCheck(aX,aY,aRad,bX,bY,bRad)) {
                    newBall = ballGenerator(ballValues[0])
                    bX = newBall.ballX
                    bY = newBall.ballY
                    bRad = newBall.ballRad
                }

                if (levelCount===5) {
                    newball.ballDX *= 1.2
                    newball.ballDY *= 1.2
                }
            })
            ballArray.push(newBall)
        }
    }
}

function monsterMakan(ballArray) {
    let monsterArray = []
    let tempBallArray = []

    ballArray.forEach(function(obj){
        if (obj.ballName === 'monster') {
            monsterArray.push(obj)
        } else {
            tempBallArray.push(obj)
        }
    })

    monsterArray.forEach(function(monstObj){
        if (monstObj.ballRad <= 75) {
            monstObj.ballRad += levelInitValues[levelCount].monsterGrow
        } else {
            monstObj.ballRad = 75
        }
        console.log(monstObj.ballRad)
        let aX = monstObj.ballX
        let aY = monstObj.ballY
        let aRad = monstObj.ballRad
        tempBallArray.forEach(function(ballObj){
            let bX = ballObj.ballX
            let bY = ballObj.ballY
            let bRad = ballObj.ballRad
            if (collideCheck(aX, aY, aRad, bX, bY, bRad)) {
                ballObj.boomed = true
            }
        })
    })
}

function boomArrayHandler(boomBallsArray) {
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
}

function arrayHousekeeping() {
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

    // if (chainArray.length >=1){
    //     let chainLength = chainArray.length
    //     for (let i = chainLength; i >= 0 ; i--) {
    //         if (!chainArray[i].chainMult) {
    //             chainArray.splice(i, 1)
    //         }
    //
    //     }
    // }
}

function lawChecks() {
    let maskChecked = $maskBtn.checked
    let circuitBreakerChecked = $circuitBreaker.checked
    let airportChecked = $closeAirports.checked

    if (maskChecked) {
        spreadRate = 1
    } else {
        spreadRate = levelInitValues[levelCount].spreadRate
    }

    if (airportChecked) {
        importRate = (levelInitValues[levelCount].importRate * 20)
    } else {
        importRate = levelInitValues[levelCount].importRate
    }

    isBallSlow = circuitBreakerChecked;


    }



// main function
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    replenishBalls(gameCounter)

    drawLine(ballArray)

    // bounce check for all balls

    bounceResolver(ballArray)

    // draw balls and move balls

    ballDrawMove(ballArray)

    // draws cursor

    drawCursor(pCursor)

    // collision check

    collisionHandler(ballArray)

    // monster makan

    monsterMakan(ballArray)

    // adjust boomball size and draw boomballs

    boomArrayHandler(boomBallsArray)

    // housekeeping for ballarray and boomballsarray

    arrayHousekeeping()

    lawChecks()

    timeKeeper()

    updateScore()

} // end of draw function

let gameRun

function timeKeeper() {

    gameTime--

    if (gameTime%gameTick) {
        $timeLeft.innerHTML = ` ${(gameTime/gameTick).toFixed(1)} seconds`
    }

    if (gameTime<=0) {
        clearInterval(gameRun)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameScore+=levelScore
        $totalScore.innerHTML = gameScore

        if (levelCount===4) {
            $finalReport.innerHTML = `Your level score is ${levelScore} and your total score is ${gameScore}!!`
            $endGame.style.display = "block"
            levelCount=0

        } else {
            levelCount++
            $levelReport.innerHTML = `You have scored ${levelScore} points for this level, Well Done!`
            $levelDesc.innerHTML = levelInitValues[levelCount].levelDesc
            $postGame.style.display = "block"

        }
    }

    if (gameCounter > 1200) {
        gameCounter = 1
    }

    gameCounter++
}

function updateScore(){

    $levelScore.innerHTML = levelScore
}

function mainGame(){
    $currentLevel.innerHTML = levelCount+1
    levelScore = 0
    mouseClick = false;
    gameCounter = 0;
    boomBallsArray = []
    chainArray = []

    ballArray = fillBallArray(levelInitValues[levelCount])

    gameTime = levelInitValues[levelCount].levelTime
    importRate = levelInitValues[levelCount].importRate
    spreadRate = levelInitValues[levelCount].spreadRate

    $maskBtn.checked = false;
    $circuitBreaker.checked = false;
    $closeAirports.checked = false;

    gameRun = setInterval(draw, gameInterval);
}

let $mainScreen = document.getElementById("main");
let $gameScreen = document.getElementById("game");
let $levelDesc = document.getElementById("levelDesc")

let $currentLevel = document.getElementById("currentLevel")
let $totalScore = document.getElementById("totalScore")
let $levelScore = document.getElementById("levelScore")
let $levelReport = document.getElementById("levelReport")
let $finalReport = document.getElementById("finalReport")
let $timeLeft = document.getElementById("timeLeft")
// let $chainCount = document.getElementById("chainCount")
let $infectedPct = document.getElementById("infectedPct")
let $infectedBar = document.getElementById("infectedBar")
let $cleanBar = document.getElementById("cleanBar")
let $maskBtn = document.getElementById("maskBtn")
let $circuitBreaker = document.getElementById("circuitBreaker")
let $closeAirports = document.getElementById("closeAirports")


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


// Get the modal
let $preGame = document.getElementById("preGame");
let $postGame = document.getElementById("postGame");
let $endGame = document.getElementById("endGame");


// Get the button that opens the modal
let $btn = document.getElementById("myBtn");


// Get the <span> element that closes the modal
let $closeBtn = document.getElementById("closeBtn");
let $nextBtn = document.getElementById("nextBtn");
let $endBtn = document.getElementById("endBtn");

// When the user clicks on the button, open the modal
$btn.onclick = function() {
    $mainScreen.style.display = "none";
    $gameScreen.style.display = "flex";
    $preGame.style.display = "block";
    $levelDesc.innerHTML = levelInitValues[levelCount].levelDesc
}

// When the user clicks on <span> (x), close the modal
$closeBtn.onclick = function() {
    $preGame.style.display = "none"
    mainGame()
}


$nextBtn.onclick = function() {
    $preGame.style.display = "block";
    $postGame.style.display = "none"
}

$endBtn.onclick = function() {
    $mainScreen.style.display = "flex";
    $gameScreen.style.display = "none";
    $endGame.style.display = "none";
    levelScore = 0
    gameScore = 0
    $totalScore.innerHTML = gameScore
}




