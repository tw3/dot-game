function DotModel(score, startX, startY, radius, fillColor, strokeWidth, strokeColor) {
  this.score = score; // score for this dot
  this.x = startX;
  this.y = startY;
  this.radius = radius;
  this.diameter = radius * 2;
  this.fillColor = fillColor;
  this.strokeWidth = strokeWidth;
  this.strokeColor = strokeColor;
}
