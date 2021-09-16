// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions. 
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, httpGet, UP_ARROW, noFill, collideRectRect, LEFT_ARROW, frameRate, RIGHT_ARROW, DOWN_ARROW, textSize, round */

// Content behind double slashes is a comment. Use it for plain English notes,
// or for code that you want to temporarily disable.

// Since this example code uses the p5 collide2d library, be sure to remind
// students to load it in. Model how to do this by either connecting a local
// copy (included in the templates), connecting a hosted copy through a CDN, or
// (as a last resort) by pasting it in its entirety in this script as the first
// line.

let backgroundColor, playerSnake, currentApple, score, gameIsOver

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frameRate(12);
}

function draw() {
  background(backgroundColor);
  let response = httpGet("https://api.coindesk.com/v1/bpi/currentprice.json")
}
