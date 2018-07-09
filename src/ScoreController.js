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
