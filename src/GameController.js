/**
 * Controls the game.
 * 
 * @param {ScoreController} _scoreController The score controller
 * @param {*} _gameSettings The game settings
 */
function GameController(_scoreController, /* "dependency injection" */
                        _gameSettings) {
  "use strict";

  var _canvasModel;
  var _gameElem;
  var _gameRenderer;

  var _minDotRadius = _gameSettings.minDotRadius;
  var _maxDotRadius = _gameSettings.maxDotRadius;
  var _dotSpeed = _gameSettings.initSpeed;
  var _renderRate = _gameSettings.renderRate;

  var _elapsedMilliseconds = 0;
  var _pxMovePerRender;

  var _isStarted = false;

  /**
   * Initializes the game/dots area of the app.
   */
  function _init() {
    _gameElem = document.getElementById("game");
    _canvasModel = _getCanvasModel();
    _gameRenderer = new GameRenderer(_gameElem, _canvasModel, _maxDotRadius, _handleDotClick);

    _setSpeed(_dotSpeed);
  }

  /**
   * Starts the game.
   */
  function _start() {
    if (_isStarted) {
      return;
    }
    _isStarted = true;

    _addDot();

    window.setTimeout(_render,  _renderRate);
  }

  /**
   * Renders the game.
   */
  function _render() {
    _elapsedMilliseconds += _renderRate;

    // Move current dots
    _gameRenderer.moveDots(_pxMovePerRender);
    
    // Add new dot if necessary
    var shouldAddDot = (_elapsedMilliseconds >= 1000);
    if (shouldAddDot) {
      _addDot();
      _elapsedMilliseconds = 0;
    }

    // Render again after a delay
    window.setTimeout(_render,  _renderRate);
  }

  /**
   * Adds a dot to the game.
   */
  function _addDot() {
    // Create dot model
    var strokeWidth = 1;
    var dotRadius = _getRandomDotRadius();
    var initialDotX = _getRandomDotX(dotRadius, strokeWidth);
    var initialDotY = 0 - dotRadius - strokeWidth - 1;
    var dotModelScore = _getDotModelScore(dotRadius);
    var dotModel = new DotModel(dotModelScore, initialDotX, initialDotY, dotRadius, 'white', strokeWidth, 'black');
    
    // Draw dot using dot model
    _gameRenderer.drawDot(dotModel);    
  }

  /**
   * Handles dot clicks (updates score and adds a new dot).
   * 
   * @param {number} dotModelScore The score of the clicked dot 
   */
  function _handleDotClick(dotModelScore) {
    _scoreController.updateScore(dotModelScore);
    window.setTimeout(function() {
      _addDot();
    }, 1000);
  }

  /**
   * Sets the dot speed.
   * 
   * @param {number} dotSpeed Dot speed 
   */
  function _setSpeed(dotSpeed) {
    _dotSpeed = dotSpeed;
    _pxMovePerRender = _getPxMovePerRender();
  }

  /**
   * Handles resize events.
   */
  function _handleResize() {
    _canvasModel = _getCanvasModel();
    _gameRenderer.updateCanvasModel(_canvasModel);
  }

  /**
   * Gets the canvas model.
   * 
   * @returns {CanvasModel} A new canvas model
   */
  function _getCanvasModel() {
    var canvasWidth = _gameElem.offsetWidth;
    var canvasHeight = _gameElem.offsetHeight;

    var canvasModel = new CanvasModel(canvasWidth, canvasHeight);
    return canvasModel;
  }

  /**
   * Gets the number of pixels to move per render.
   * 
   * @returns {number} The number of pixels to move per render
   */
  function _getPxMovePerRender() {
    return _dotSpeed / (1000 / _renderRate);
  }

  /**
   * Gets a random radius value.
   * @return A random radius value
   */
  function _getRandomDotRadius() {
    return _getRandomInt(_minDotRadius, _maxDotRadius);
  }

  /**
   * Gets a random X value for a new dot.
   * 
   * @param {number} dotRadius The radius for the dot
   * @param {number} strokeWidth The stroke width for the dot
   * @returns {number} A random X value
   */
  function _getRandomDotX(dotRadius, strokeWidth) {
    var sum = dotRadius + strokeWidth;
    var minX = sum;
    var maxX = _canvasModel.width - sum;
    var randomInt = _getRandomInt(minX, maxX);
    return randomInt;
  }

  /**
   * Gets the dot model score.
   * 
   * @param {number} dotRadius The dot radius, must be greater than 0
   * @returns {number} The dot model score
   */
  function _getDotModelScore(dotRadius) {
    // 10px diameter (5px radius) is worth 10 points
    // 100px diameter (50px radius) is worth 1 point
    return Math.round(50 / dotRadius);
  }

  /**
   * Gets a random integer between the min and max numbers.
   * 
   * @param {number} min The minimum integer
   * @param {number} max The maximum integer
   * @returns {number} A random integer between the min and max numbers
   */
  function _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Initialize the game as soon as this file is loaded
  _init();

  // Expose some methods to start and update the game
  return {
    start: _start,
    updateSpeed: _setSpeed,
    handleResize: _handleResize
	};

}
