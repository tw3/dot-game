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
AppController = (function () {
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
      if ( !_resizeTimeout ) {
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
