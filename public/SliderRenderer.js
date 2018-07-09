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
