
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

    var userX = 0;
    var userY = 0;

    // Create the canvas
    var gameBoard, inputPanel;
    var gameBoardContext, panelContext;

    gameBoard  = document.getElementById("gameBoard");
    gameBoard.width = window.innerWidth;
    gameBoard.length = window.innerHeight;

    inputPanel  = document.getElementById("inputPanel");
    inputPanel.width = gameBoard.width;
    inputPanel.length = gameBoard.length / 4;

    if (gameBoard.getContext) 
    {
        gameBoardContext = gameBoard.getContext("2d");
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        gameBoard.addEventListener("mousedown", setSelection, false)

    }

    if(inputPanel.getContext)
    {
        panelContext = inputPanel.getContext("2d");
        panelContext.font = "20px Georgia";

    }

    //--Player Values
    var player = 
    {
        score: 0,
        correct: 0
    };

    //--Square Values
    var squareSpeed = 50;
    var numOfSquares = ROW_COUNT * COLUMN_COUNT;
    var squares = new Array(numOfSquares);
    

    function Square(x, y) 
    {
        //-Default Values
        this.x = x;
        this.y = y;
        this.color = getRandomColor();
        this.live  = true;
        speed = 50;
        direction = 1;
        sizeX = SQUARE_SIZE_X;
        sizeY = SQUARE_SIZE_Y;
    }
    Square.prototype.resetPos = function (x,y)
    {
        this.live = true;
        this.x = x;
        this.y = y;
        this.color = getRandomColor();
    }
    Square.prototype.draw = function (context)
    {
        //context.clearRect(this.x, this.y, SQUARE_SIZE_X, SQUARE_SIZE_Y);
        context.fillStyle = this.color;
        //context.fillRect(Math.floor(this.x), Math.floor(this.y), SQUARE_SIZE_X, SQUARE_SIZE_Y);
        context.fillRect(this.x, this.y, SQUARE_SIZE_X, SQUARE_SIZE_Y);
    };



    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    // Let's play this game!
    initSquares();
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

    //--Draw everything
    function render(dt) 
    {
        //--Render Background
        gameBoardContext.clearRect(0, 0, gameBoard.width, gameBoard.height);
        //gameBoardContext.fillStyle = 'white';
        //gameBoardContext.fill();
        
        for(var i = 0; i < numOfSquares; i++)
        {
            squares[i].y += squareSpeed * dt;
        }

        //--Render Squares
        for(var i = 0; i < numOfSquares; i++)
        {

            //--Test For Live Square
            if (squares[i].live == true)
            {
                squares[i].draw(gameBoardContext);

                if (userX >= squares[i].x && 
                userX <= (squares[i].x + SQUARE_SIZE_X) &&
                userY >= squares[i].y && 
                userY <= (squares[i].y + SQUARE_SIZE_Y) &&
                squares[i].color == 'black')
                {
                    player.score+= 10;
                    player.correct ++;
                    squareSpeed+= 2;
                    squares[i].live = false;
                }
            }

            //--Update Squares
            if (squares[i].y + (SQUARE_SIZE_Y / 2) > ((COLUMN_COUNT-1) * (SQUARE_SIZE_Y + SQUARE_PADDING)))
            {
                squares[i].resetPos(squares[i].x, (SQUARE_PADDING - SQUARE_SIZE_Y));
            }

            
        }
        panelContext.clearRect(0,0,gameBoard.width, gameBoard.length / 4)
        panelContext.fillStyle = 'white';
        panelContext.fillText("Score:" + squareSpeed, 100, 100);
        

        //--Reset User
        userX = 0;
        userY = 0;

    }

    var now, dt;

    // The main game loop
    function main() 
    {

        if(!running) 
        {
            return;
        }

        now = Date.now();
        dt = (now - then) / 1000.0;
        render(dt);

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
            squares[i] = new Square((row * SQUARE_SPACING + SQUARE_PADDING), (column * SQUARE_SPACING + SQUARE_PADDING));
           

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

        if (rndNum == 1)
        {
            color = '#086FA1';
        }
        else if (rndNum == 2)
        {
            color = '#1D7074';
        }
        else if(rndNum == 3)
        {
            color = '#63ADD0';
        }
        else if(rndNum == 4)
        {
            color = 'black';
        }
        
        return color;
    }

    function setSelection(event)
  {
      userX = event.pageX;
      userY = event.pageY;
  }


};


