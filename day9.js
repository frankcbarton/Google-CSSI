// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions. 
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize */

// Content behind double slashes is a comment. Use it for plain English notes,
// or for code that you want to temporarily disable.

// Since this example code uses the p5 collide2d library, be sure to remind
// students to load it in. Model how to do this by either connecting a local
// copy (included in the templates), connecting a hosted copy through a CDN, or
// (as a last resort) by pasting it in its entirety in this script as the first
// line.

let dots;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  colorMode(HSB, 360, 100, 100);
  dots = [];
  for(let i = 0; i < 10; i++) {
    dots.push(new BouncyDot())
  }
}

function draw() {
  background(220, 0, 80);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    dot.move()
    dot.draw()
  }
}

class BouncyDot {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(5,12);
    this.color = random(360);
    this.masterXvelocity = random(0.5,7);
    this.masterYvelocity = random(0.5,7);
    this.xVelocity = this.masterXvelocity;
    this.yVelocity = this.masterYvelocity;
  }
  
  move() {
    if (this.x > width) {
      this.xVelocity = -1 * this.masterXvelocity;
    }
    if (this.x < 0) {
      this.xVelocity = this.masterXvelocity;
    }
    if (this.y > height) {
      this.yVelocity = -1 * this.masterYvelocity;
    }
    if (this.y < 0) {
      this.yVelocity = this.masterYvelocity;
    }
    
    this.y += this.yVelocity
    this.x += this.xVelocity
  }
  
  draw() {
    fill(this.color, 80, 70);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

function mousePressed() {
// We'll use this for console log statements only.
  const dot = dots[0];
  console.log(dot);
}