var gameArea;
var gameBoard;
var gamePanel;
var areaContext;
var boardContext;
var panelContext;


function init() {
  gameArea = document.getElementById('gameArea');
  if (gameArea.getContext) {
    gameContext = gameArea.getContext("2d");

    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    resizeCanvas();
  }
}
 
function resizeCanvas() {
  gameArea.width = window.innerWidth;
  gameArea.height = window.innerHeight;
}