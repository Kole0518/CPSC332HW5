const color1 = "#0095DD";

window.onload = function ()
{
    // canvas values
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height - 30;

    // start button values
    let startButtonX = canvas.width / 2 - 35;
    let startButtonY = canvas.height / 2 - 30;
    let startButtonWidth = 75;
    let startButtonHeight = 45;

    // paused bool
    let isPaused = false
    
    // ball values
    let ballSpeedMultiplier = document.getElementById("gameSpeed");
    let ballSpeedLabel = document.getElementById("labelSpeed");
    let dx = 3;
    let dy = 3;
    let ballRadius = 10;

    // paddle values
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    // key pressed
    let rightPressed = false;
    let leftPressed = false;

    // brick values
    let brickRowCount = 5;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;

    // game stat values
    let score = 0;
    const maxLives = 3;
    let lives = 3;
    let highScore = 0;

    // options menu buttons
    let pauseGameButton = document.getElementById("gamePause");
    let newGameButton = document.getElementById("newGame");
    let continueGameButton = document.getElementById("continueGame");
    let reloadGameButton = document.getElementById("gameReload");

    let bricks = [];

    // brick spawner
    for (let c = 0; c < brickColumnCount; c++)
    {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++)
            bricks[c][r] = { x: 0, y: 0, status: 1 };
    }

    // event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    // ball speed slider listener
    ballSpeedMultiplier.addEventListener("input", adjustGameSpeed);

    // options menu button listeners
    pauseGameButton.addEventListener("click", function()
    {
        if (isPaused == false)
        {
            togglePauseGame();
        }
    });
    newGameButton.addEventListener("click", startNewGame(highScore));
    continueGameButton.addEventListener("click", continuePlaying);
    reloadGameButton.addEventListener("click", function()
    {
        location.reload();
    });

    function keyDownHandler(e)
    {
        if (e.keyCode == 39)
            rightPressed = true;
        else if (e.keyCode == 37)
            leftPressed = true;
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39)
            rightPressed = false;
        else if (e.keyCode == 37)
            leftPressed = false;
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width)
            paddleX = relativeX - paddleWidth / 2;
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++)
        {
            for (let r = 0; r < brickRowCount; r++)
            {
                let b = bricks[c][r];

                if (b.status == 1)
                {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight)
                    {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount)
                        {
                            //TODO: draw message on the canvas
                            checkWinState();
                        }
                    }
                }
            }
        }
    }

    function drawBall()
    {
        context.beginPath();
        context.arc(x, y, ballRadius, 0, Math.PI * 2);
        context.fillStyle = color1;
        context.fill();
        context.closePath();
    }

    function drawPaddle()
    {
        context.beginPath();
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = color1;
        context.fill();
        context.closePath();
    }

    function drawBricks()
    {
        for (let c = 0; c < brickColumnCount; c++)
        {
            for (let r = 0; r < brickRowCount; r++)
            {
                if (bricks[c][r].status == 1)
                {
                    let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    context.beginPath();
                    context.rect(brickX, brickY, brickWidth, brickHeight);
                    context.fillStyle = color1;
                    context.fill();
                    context.closePath();
                }
            }
        }
    }
    function drawScore()
    {
        context.font = "16px Arial";
        context.fillStyle = color1;
        context.fillText("Score: " + score, 60, 20);
    }

    function drawLives()
    {
        context.font = "16px Arial";
        context.fillStyle = color1;
        context.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius)
        {
            if (x > paddleX && x < paddleX + paddleWidth)
                dy = -dy;
            else
            {
                lives--;
                if (lives <= 0)
                {
                    //TODO: draw message on the canvas
                    checkWinState();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth)
            paddleX += 7;
        else if (leftPressed && paddleX > 0) 
            paddleX -= 7;

        //TODO: adjust speed
        x += dx;
        y += dy;

        //TODO: pause game check
        if (isPaused == false)
        {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional letiables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game letiable            
    //high score tracking letiables
    //other letiables?            

    //event listeners added
    //game speed changes handler            
    //pause game event handler            
    //start a new game event handler            
    //continue playing
    //reload click event listener            

    //Drawing a high score
    function drawHighScore()
    {
        highScore = score;
    }

    //draw the menu screen, including labels and button
    function drawMenu()
    {
        //draw the rectangle menu backdrop
        context.fillStyle = "royalblue";
        setShadow();
        context.fillRect(15, 15, 450, 290);

        //draw the menu header
        context.font = "bold 25pt Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        setShadow();
        context.fillText("BREAKOUT GAMING!", canvas.width / 2, 80);

        //start game button area
        context.fillStyle = "magenta";
        context.fillRect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
        context.font = "bold 20pt Arial";
        context.fillStyle = "gray";
        context.textAlign = "center";
        setShadow();

        context.fillText("Start", canvas.width / 2, canvas.height / 2);

        //event listener for clicking start
        canvas.addEventListener("click", startGameClick);
        //need to add it here because the menu should be able to come back after 
        //we remove the it later                
    }

    //function used to set shadow properties
    function setShadow()
    {
        context.shadowBlur = 10;
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;
        context.shadowColor = "black";
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow()
    {
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = null;
    };

    //function to clear the menu when we want to start the game
    function clearMenu()
    {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game
        canvas.removeEventListener("click", startGameClick);
        context.clearRect(0, 0, canvas.width, canvas.height);                
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event)
    {
        var valX = event.pageX - canvas.offsetLeft;
        var valY = event.pageY - canvas.offsetTop;

        if (valX > startButtonY && valX > startButtonX && valY < (startButtonY + startButtonHeight) && valX < (startButtonX + startButtonWidth))
        {
            clearMenu();
            resetShadow();
            draw();
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed()
    {
        //update the slider display                
        //update the game speed multiplier  
        ballSpeedLabel.innerHTML = ballSpeedMultiplier.value;
        dx = 3 * ballSpeedMultiplier;
        dy = 3 * ballSpeedMultiplier; 
    };

    //function to toggle the play/paused game state
    function togglePauseGame()
    {
        isPaused = !isPaused;
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState()
    {
        context.font = "bold 25pt Arial";
        context.fillStyle = "black";
        context.textAlign = "center";

        if (score == brickRowCount * brickColumnCount) // win
        {
            drawHighScore();
            context.fillText("YOU WIN!!!!!!!!!!", canvas.width / 2, canvas.height / 2);
        }
        else
        {
            context.fillText("YOU LOST!!!!!!!!!!", canvas.width / 2, canvas.height / 2);
        }

        //TODO: pause game instead of reloading
        togglePauseGame();
    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore)
    {

    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying()
    {
        if (lives != maxLives)
        {
            resetBoard(true);
        }
        else
        {
            resetBoard(false);
        }
    };

    //function to reset starting game info
    function resetBoard(resetLives)
    {   
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //reset paddle position
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;

        // reset game stats
        score = 0;
        if (resetLives == true)
        {
            lives = maxLives;
        }

            // brick spawner
        for (let c = 0; c < brickColumnCount; c++)
        {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++)
                bricks[c][r] = { x: 0, y: 0, status: 1 };
        }

        togglePauseGame();

        //reset game pieces
        draw();
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game            
    drawMenu();

};//end window.onload function