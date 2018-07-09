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
