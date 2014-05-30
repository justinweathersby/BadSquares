
window.onload = function() 
{

    // A cross-browser requestAnimationFrame
    // See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //--Global Variables
    var SQUARE_SIZE_X = 60;
    var SQUARE_SIZE_Y = 60;
    var SQUARE_SPACING = 70;
    var SQUARE_PADDING = 20;
    var ROW_COUNT = 4;
    var COLUMN_COUNT = 7;

    // Create the canvas
    var gameBoard;
    var gameBoardContext;

    gameBoard  = document.getElementById("gameBoard");
    gameBoard.width = window.innerWidth;
    gameBoard.length = window.innerHeight;

    if (gameBoard.getContext) 
    {
        gameBoardContext = gameBoard.getContext("2d");
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
    }

    //--Player Values
    var player = 
    {
        score: 0,
        correct: 0
    };

    //--Square Values
    var numOfSquares = ROW_COUNT * COLUMN_COUNT;
    var squares = new Array(numOfSquares);
    

    function square(color, live, x, y) 
    {
        //-Default Values
        this.live  = live;
        speed = 50;
        direction = 1;
        sizeX = SQUARE_SIZE_X;
        sizeY = SQUARE_SIZE_Y;
        this.color = color;
        this.x = x;
        this.y = y;
    }



    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    // Let's play this game!
    reset();
    var then = Date.now();
    var running = true;
    main();


    // Functions ---

    function resizeCanvas() {
        gameBoard.width = window.innerWidth;
        gameBoard.height = window.innerHeight;
    }

    // Reset game to original state
    function reset() 
    {
      

         initSquares();

        //--Reset Player Scores
        player.score = 0;
        player.correct = 0;
    }

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }

    // Update game objects.
    // We'll use GameInput to detect which keys are down.
    // If you look at the bottom of index.html, we load GameInput
    // from js/input.js right before app.js
    function update(dt) {
        // Speed in pixels per second
        var playerSpeed = 50;

        if(GameInput.isDown('DOWN')) {
            // dt is the number of seconds passed, so multiplying by
            // the speed gives you the number of pixels to move
            pause();
        }

        if(GameInput.isDown('UP')) {
            unpause();
        }

        if(GameInput.isDown('LEFT')) {
            square.x -= playerSpeed * dt;
        }

        if(GameInput.isDown('RIGHT')) {
            square.x += playerSpeed * dt;
        }

         //--Update Falling Squares Position
        for(var i = 0; i < numOfSquares; i++)
        {
            if (squares[i].y + (SQUARE_SIZE_Y / 2) > ((COLUMN_COUNT-1) * (SQUARE_SIZE_Y + SQUARE_PADDING)))
            {
                squares[i].live  = false;
                squares[i] = new square(getRandomColor(), true, squares[i].x, (SQUARE_PADDING - SQUARE_SIZE_Y));
            }
            else
            {
                squares[i].y += playerSpeed * dt;
            }
            
        }

        // You can pass any letter to `isDown`, in addition to DOWN,
        // UP, LEFT, RIGHT, and SPACE:
        // if(GameInput.isDown('a')) { ... }
    }

    //--Draw everything
    function render() 
    {
        //--Render Background
        var blueGradient = gameBoardContext.createLinearGradient(0,0, gameBoard.width, gameBoard.height);
        blueGradient.addColorStop(0.000, 'rgba(25, 216, 255, 1.000)');
        blueGradient.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
        gameBoardContext.rect(0, 0, gameBoard.width, gameBoard.height);
        gameBoardContext.fillStyle = blueGradient;
        gameBoardContext.fill();
   
        //--Render Squares
        for(var i = 0; i < numOfSquares; i++)
        {
            //--Test For Live Square
            if (squares[i].live == true)
            {
                gameBoardContext.fillStyle = squares[i].color;
                gameBoardContext.fillRect(squares[i].x, squares[i].y, SQUARE_SIZE_X, SQUARE_SIZE_Y);
            }
        }
    }

    // The main game loop
    function main() 
    {
        if(!running) 
        {
            return;
        }

        var now = Date.now();
        var dt = (now - then) / 1000.0;

        update(dt);
        render();

        then = now;
        requestAnimFrame(main);
    }

    function initSquares()
    {
        var column = 0;
        var row = 0;

        //--Initiate Squares
        for(var i = 0; i < numOfSquares; i++)
        {
            squares[i] = new square(getRandomColor(), true, (row * SQUARE_SPACING + SQUARE_PADDING), (column * SQUARE_SPACING + SQUARE_PADDING));
           

            if(row == ROW_COUNT - 1)
            {
                column++;
                row = 0;
            }
            else
            {
                row++;
            }
            
        }
    }

    function getRandomColor()
    {
        var rndNum = Math.floor((Math.random() * 4) + 1);
        var color = 'white';

        switch(rndNum){
            case 1:
                color = 'orange';
            break;
            case 2:
                color = 'red';
            break;
            case 3:
                color = 'blue';
            break;
            case 4:
                color = 'black';
            break;
            
        }

        return color;
    }
};
