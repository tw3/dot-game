/**
 * For most classes I chose to implement OOP using the
 * "revealing module pattern" instead of using prototype
 * functions to provide encapsulation of private member
 * variables and methods and avoid annoying references
 * to "this" since we don't use inheritance for this project.
 * 
 * https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
 * 
 * Another option is the "revealing prototype pattern"
 * which might be suitable if we needed inheritance.
 * 
 * There many ways to optimize this code using TypeScript,
 * e.g. add types to prevent unwanted type casting, use modules
 * to import and export classes or functions, make use of many
 * of the new Array prototype functions.
 */

 /**
  * App starts here, this singleton coordinates the interaction
  * between the score, the slider, and the game.
  */
var AppController = (function () {
  "use strict";

  var _scoreController;
  var _sliderController;
  var _gameController;

  var _settings = {
    minDotRadius: 5,
    maxDotRadius: 50,
    minSpeed: 10,
    maxSpeed: 100,
    initSpeed: 10,
    renderRate: 100
  };

  var _resizeTimeout;

  /**
   * Initializes the app.
   */
  function _init() {
    // Create controllers
    _scoreController = new ScoreController();

    _sliderController = new SliderController(_settings.minSpeed,
      _settings.maxSpeed, _settings.initSpeed);

    _gameController = new GameController(_scoreController, _settings);
    
    // Add slider change handler
    _sliderController.addChangeHandler(_handleSliderChange);

    // React to window resize events
    // https://developer.mozilla.org/en-US/docs/Web/Events/resize
    window.addEventListener("resize", _throttle(_handleWindowResize, 200), false);

    // Start game
    _gameController.start();
  }

  /**
   * Updates the game with the new speed from the slider.
   * 
   * @param {number} newSpeed New speed from the slider
   */
  function _handleSliderChange(newSpeed) {
    _gameController.updateSpeed(newSpeed);
  }

  /**
   * Throttles calls the input function.
   * 
   * @param {Function} func Function to trigger after throttling 
   * @param {number} duration Throttle duration in milliseconds
   * @returns {Function} The throttled function
   */
  function _throttle(func, duration) {
    var throttledFunction = function() {
      if (!_resizeTimeout) {
        _resizeTimeout = setTimeout(function() {
          _resizeTimeout = null;
          func();
        }, duration);
      }
    }
    return throttledFunction;
  }

  /**
   * Updates the app when the window is resized.
   */
  function _handleWindowResize() {
    _gameController.handleResize();
  }

  // Initialize the app when the page is loaded.
  window.addEventListener("load", function(event) {
    _init();
  });

	return {
  // No public methods to expose
};

})();

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

/**
 * The game renderer.
 * 
 * @param {Element} _parent The parent element for the game
 * @param {*} _canvasModel The canvas model
 * @param {*} _maxDotRadius The maximum dot radius
 * @param {*} _dotClickedCb A callback function when the dot is clicked
 */
function GameRenderer(_parent, _canvasModel, _maxDotRadius, _dotClickedCb) {
  "use strict";

  var _clickEventOptions = {
    capture: false,
    once: false
  };
  var _boundHandleDotClick = _handleDotClick.bind(this);
  var _canvasElem = undefined;

  /**
   * Initializes the game renderer.
   */
  function _init() {
    _drawCanvas();
  }

  /**
   * Draws the game canvas.
   * 
   * For example:
   * <svg height="100" width="100" />
   */
  function _drawCanvas() {
    if (_canvasElem === undefined) {
      var canvasElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      canvasElem.setAttribute("width", _canvasModel.width);
      canvasElem.setAttribute("height", _canvasModel.height);
      // var viewBoxVal = "0 0 " + _canvasModel.width + " " + _canvasModel.height;
      // canvasElem.setAttribute("viewBox", viewBoxVal);

      // listen on the canvas rather than the dot itself to prevent an excessive amount
      // of event listeners from getting created and destroyed
      // listen for mousedown instead of click b/c moving clicks register as drags
      var eventName = "mousedown";
      canvasElem.addEventListener(eventName, _boundHandleDotClick, _clickEventOptions);

      _canvasElem = canvasElem;
      _parent.appendChild(_canvasElem);
    } else {
      // Canvas already drawn
    }
  }

  /**
   * Draws the circle.
   * 
   * For example:
   * <circle cx="50" cy="50" r="50" fill="gray" stroke-width="1" stroke="black" />
   * Reference:
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Scripting
   */
  function _drawDot(dotModel) {
    var dotElem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dotElem.setAttributeNS(null, "data-dot-score", dotModel.score);
    dotElem.setAttributeNS(null, "class", "game-dot");
    dotElem.setAttributeNS(null, "cx", dotModel.x);
    dotElem.setAttributeNS(null, "cy", dotModel.y);
    dotElem.setAttributeNS(null, "r", dotModel.radius);
    dotElem.setAttributeNS(null, "fill", dotModel.fillColor);
    dotElem.setAttributeNS(null, "stroke-width", dotModel.strokeWidth);
    dotElem.setAttributeNS(null, "stroke", dotModel.strokeColor);

    // Add as the first child to preserve z order
    var firstChildElem = _canvasElem.firstChild;
    if (firstChildElem) {
      _canvasElem.insertBefore(dotElem, firstChildElem);
    } else {
      _canvasElem.appendChild(dotElem);
    }
  }

  /**
   * Moves all dots in the game down a fixed amount.
   * 
   * @param {number} moveAmount The amount to move each dot in pixels
   */
  function _moveDots(moveAmount) {
    var children = _canvasElem.childNodes;
    var len = children.length;
    var shouldCheckOffscreen = true;

    // Move dots from bottom of screen to top of screen to optimize offscreen removal
    for (var i = len - 1; i >= 0; i--) {
      // surround with try-catch b/c dot elements can get removed during move
      try {
        var dotElem = children[i];
        var dotY = parseInt(dotElem.getAttribute("cy"));

        // Remove any offscreen dots
        if (shouldCheckOffscreen) {
          var isOffscreen = _isDotOffscreen(dotElem, dotY);
          if (isOffscreen) {
            _removeDot(dotElem);
            continue;
          } else {
            shouldCheckOffscreen = false;
          }
        }

        var newDotY = parseInt(dotY + moveAmount);
        dotElem.setAttribute("cy", newDotY);
      } catch (ex) {
      }
    }
  }

  /**
   * Updates the canvas model, e.g. for window resizes.
   * 
   * @param {CanvasModel} canvasModel The new canvas model
   */
  function _updateCanvasModel(canvasModel) {
    _canvasElem.setAttribute("width", canvasModel.width);
    _canvasElem.setAttribute("height", canvasModel.height);
    // var viewBoxVal = "0 0 " + canvasModel.width + " " + canvasModel.height;
    // _canvasElem.setAttribute("viewBox", viewBoxVal);
    _canvasModel = canvasModel;
  }

  /**
   * Handles clicks on dots.
   * 
   * @param {Event} event The click event
   */
  function _handleDotClick(event) {
    // Get the clicked dot element
    var dotElem = event.target;
    if (!dotElem.hasAttribute("data-dot-score")) {
      // Not the dot element
      return;
    }

    // Get the model id
    var dotScore = parseInt(dotElem.getAttribute("data-dot-score"));

    // Remove the dot
    _removeDot(dotElem);

    // Trigger the dot clicked callback
    _dotClickedCb.apply(null, [dotScore]);

    // Cancel event bubbling
    event.stopPropagation();
  }

  /**
   * Determines whether the input dot is offscreen.
   * 
   * @param {Element} dotElem The dot element
   * @param {number} dotY The Y value for the dot
   * @returns {boolean} True if the dot is offscreen, false if the dot is onscreen.
   */
  function _isDotOffscreen(dotElem, dotY) {
    // Dot is offscreen when the top of the dot is beyond the height of the canvas
    var radiusVal = parseInt(dotElem.getAttribute("r"));
    var dotTopY = dotY - radiusVal;
    var isOffscreenY = (dotTopY > _canvasModel.height);
    if (isOffscreenY) {
      return true;
    }

    // Dot is offscreen when the left side of the dot is beyond the width of the canvas
    // Disabled to improve performance
    // var dotX = parseInt(dotElem.getAttribute("cx"));
    // var dotLeftX = dotX - radiusVal;
    // var isOffscreenX = (dotLeftX > _canvasModel.width);
    // if (isOffscreenX) {
    //   return true;
    // }

    return false;
  }

  /**
   * Removes the input dot element from the screen.
   * 
   * @param {Element} dotElem The dot element
   */
  function _removeDot(dotElem) {
    _canvasElem.removeChild(dotElem);
  }

  // Initialize the renderer immediately
  _init();

  // Expose some methods
  return {
    drawDot: _drawDot,
    moveDots: _moveDots,
    updateCanvasModel: _updateCanvasModel
  };
  
}

/**
 * Controls the score.
 */
function ScoreController() {
  var _scoreRenderer;
  var _totalScore = 0;

  /**
   * Initializes the score.
   */
  function _init() {
    var scoreElem = document.getElementById('score');
    _scoreRenderer = new ScoreRenderer(scoreElem);
    _scoreRenderer.drawScore(_totalScore);
  }

  /**
   * Updates the total score.
   * 
   * @param {number} dotModelScore A new score to add to the total score
   */
  function _updateScore(dotModelScore) {
    _totalScore = _totalScore + dotModelScore;
    _scoreRenderer.drawScore(_totalScore);
  }

  // Initialize immediately
  _init();

  // Expose a method to update the score
  return {
    updateScore: _updateScore
	};

}

/**
 * Renders the score.
 * 
 * @param {Element} _parent The parent element for the score 
 */
function ScoreRenderer(_parent) {

  /**
   * Initializes the renderer.
   */
  function _init() {
  }

  /**
   * Draws the new score
   * 
   * @param {number} newScore The new score 
   */
  function _drawScore(newScore) {
    _parent.innerHTML = newScore;
  }

  // Initialize immediately
  _init();

  // Expose a method to draw the new score
  return {
    drawScore: _drawScore
  };
}

/**
 * Controls the slider.
 * 
 * @param {number} _minVal The minimum value for the slider 
 * @param {number} _maxVal The maximum value for the slider
 * @param {number} _initVal The initial value for the slider
 */
function SliderController(_minVal, _maxVal, _initVal) {
  var _sliderRenderer;

  /**
   * Initializes the slider.
   */
  function _init() {
    var sliderContainerElem = document.getElementById('sliderContainer');
    _sliderRenderer = new SliderRenderer(sliderContainerElem,
      _minVal, _maxVal, _initVal);
    _sliderRenderer.drawSlider();
  }

  /**
   * Adds an event handler for when the slider changes.
   * 
   * @param {Function} sliderChangeCB A callback function for when the slider changes
   */
  function _addChangeHandler(sliderChangeCB) {
    _sliderRenderer.addChangeHandler(sliderChangeCB);
  }

  // Initialize immediately
  _init();

  // Expose a method to add a change event handler
  return {
    addChangeHandler: _addChangeHandler
	};

}

/**
 * Renders the slider.
 * 
 * @param {ELement} _parent The parent element for the slider 
 * @param {number} _minVal The minimum value for the slider
 * @param {number} _maxVal The maximum value for the slider
 * @param {number} _initVal The initial value for the slider
 */
function SliderRenderer(_parent, _minVal, _maxVal, _initVal) {
  var _sliderElem;

  /**
   * Initializes the renderer.
   */
  function _init() {
  }

  /**
   * Draws the slider.
   */
  function _drawSlider() {
    _sliderElem = document.createElement("input");
    _sliderElem.setAttribute("type", "range");
    _sliderElem.setAttribute("min", _minVal);
    _sliderElem.setAttribute("max", _maxVal);
    _sliderElem.setAttribute("value", _initVal);
    _parent.appendChild(_sliderElem);
  }

  /**
   * Adds an event handler for the when the slider value changes
   * 
   * @param {Function} sliderChangeCB A callback function for when the slider changes
   */
  function _addChangeHandler(sliderChangeCB) {
    _sliderElem.addEventListener("change", function(event) {
      var newValue = parseInt(event.target.value);
      sliderChangeCB.apply(null, [newValue]);
    });
  }

  // Initialize immediately
  _init();

  // Expose some methods to draw the slider and listen for changes
  return {
    drawSlider: _drawSlider,
    addChangeHandler: _addChangeHandler
	};

}

function CanvasModel(width, height) {
  this.width = width;
  this.height = height;
}

function DotModel(score, startX, startY, radius, fillColor, strokeWidth, strokeColor) {
  this.score = score; // score for this dot
  this.x = startX;
  this.y = startY;
  this.radius = radius;
  this.fillColor = fillColor;
  this.strokeWidth = strokeWidth;
  this.strokeColor = strokeColor;
}
