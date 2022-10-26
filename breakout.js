const color1 = "#0095DD";

window.onload = function ()
{
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 5;
    let brickColumnCount = 3;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;
    let score = 0;
    let lives = 3;

    let bricks = [];

    for (let c = 0; c < brickColumnCount; c++)
    {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++)
            bricks[c][r] = { x: 0, y: 0, status: 1 };

    }

    // Listeners and methods to control paddle movement (left & right arrows, mouse movement)
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

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
                            //TODO: pause game instead of reloading
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawBall()
    {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle()
    {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
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
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore()
    {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives()
    {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    //TODO: pause game instead of reloading
                    document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

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

        //draw the menu header

        //start game button area

        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later                
    }

    //function used to set shadow properties
    function setShadow()
    {

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