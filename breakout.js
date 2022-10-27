const color1 = "#0095DD";

window.onload = function ()
{
    // canvas values
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height - 30;

    // paused bool
    let isPaused = false
    
    // ball values
    let ballSpeed = document.getElementById("gameSpeed");
    let ballSpeedLabel = document.getElementById("labelSpeed");
    let dx = ballSpeed.value;
    let dy = -ballSpeed.value;
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
    let lives = 99;
    let highSchore = 0;

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

    ballSpeed.addEventListener("input", () => {
        ballSpeedLabel.innerHTML = ballSpeed.value;
        dx = ballSpeed.value;
        dy = -ballSpeed.value;
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
                            //TODO: pause game instead of reloading
                            togglePauseGame();
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
                    //TODO: pause game instead of reloading
                    togglePauseGame();
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

        requestAnimationFrame(draw);
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

    }

    //draw the menu screen, including labels and button
    function drawMenu()
    {
        //draw the rectangle menu backdrop
        context.fillStyle("royalblue");
        context.fillRect(460, 0, 300, 0)

        //draw the menu header

        //start game button area

        //event listener for clicking start
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

    };

    //function to clear the menu when we want to start the game
    function clearMenu()
    {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game                
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event)
    {

    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed()
    {
        //update the slider display                
        //update the game speed multiplier                
    };

    //function to toggle the play/paused game state
    function togglePauseGame()
    {
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState()
    {

    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore)
    {

    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying()
    {

    };

    //function to reset starting game info
    function resetBoard(resetLives)
    {
        //reset paddle position
        //reset bricks               
        //reset score and lives               
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game            
    draw();

};//end window.onload function