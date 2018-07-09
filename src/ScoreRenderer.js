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
