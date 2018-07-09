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
