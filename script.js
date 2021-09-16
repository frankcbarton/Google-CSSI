// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, httpGet, max, min, textFont, textAlign, CENTER, UP_ARROW, noFill, collideRectRect, LEFT_ARROW, frameRate, RIGHT_ARROW, DOWN_ARROW, textSize, round, keyIsPressed, pmouseX, pmouseY, collideLineCircle, BOLD, textStyle, push, pop NORMAL*/

let backgroundImage, playerObject, gravity, gameOn, movePlayerObject, lines, targetImage, targetObject, targetImageWidth, targetImageHeight, obstacles, obstacleColor, UFOImage, UFOImageSize, level, startingLevel, time, lives;

function setup() {
  // Canvas Settings
  width = 600;
  height = 400;
  createCanvas(width, height);
  
  // Global Variables Settings
  gameOn = true;
  movePlayerObject = false;
  gravity = 0.5;
  time = 0
  lives = 3;
  level = -1;
  startingLevel = 0; // Change to adjust which level initially displayed
  
  // Initial Object Setup 
  lines = [];
  obstacles = [];
  playerObject = new Player();
  targetObject = new Target();
  
  // Target Image Settings
  targetImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2F17-176080_spaceship-cartoon-clipart-library-clipart-rocket.png?v=1628185866919");
  targetImageWidth = 65;
  targetImageHeight = targetImageWidth * 2;
  
  // UFO Image Settings
  UFOImage = loadImage("https://cdn.glitch.com/b2662aa6-b1e0-44bb-9743-e261c4ecc90c%2FAlien%20Ship.png?v=1628184143136");
  UFOImageSize = 50;
  
  // Starts at Starting Level
  for (let i = 0; i < startingLevel + 1; i++) {
    setLevel(true);
  }
  
  // Frame Rate Setup
  frameRate(144);
}

function draw() {
  background(backgroundImage);
  // Draw Objects
  playerObject.draw();
  targetObject.draw();
  
  /// Draw lines
  for (let line of lines) {
    strokeWeight(5);
    line.draw();
  }
  /// Draw Obstacles
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
  
  // Calls on DisplayText
  displayText();
  
  if (gameOn) {
    /// Incriment Time
    time += 0.1;
    
    // Moves PlayerObjects
    if (movePlayerObject) {
      playerObject.move();
    }
  }
}

// Starts drawing line when mouse is pressed
function mousePressed() {
  lines.push(new Line);
}

// Finished drawing line when mouse is released
function mouseReleased() {
  let currentLine = lines[lines.length - 1];
  currentLine.drawLine = true;
}

// Drops ball when key is pressed & Starts first level
function keyPressed() {
  if (level === 0) {
    setLevel(true);
  } else {
    movePlayerObject = true;
  }
}

class Player {
  constructor(x, y){
    this.r = 25;
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.lineCollision = false;
    this.prevLineDirection = 1;
  }
  
  draw() {
    if (!movePlayerObject) {
      image(UFOImage, this.x - UFOImageSize/2, this.y - UFOImageSize * 6/5, UFOImageSize, UFOImageSize * 6/5);
    }
    fill(65);
    noStroke();
    ellipse (this.x, this.y, this.r); // draws the object or Image. 
  }
  
  move() {
    // Moves down when not colliding with line
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    if (!this.lineCollision) {
      this.yVelocity += gravity;
    }
    // Bounces along line when colliding with said line
    for (let i = 0; i < lines.length; i++) {
      if (collideLineCircle(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2, this.x, this.y, this.r)) {
        this.lineCollision = true;
        // Sets lineHeight = vertical height of line
        let lineHeight = lines[i].y2 - lines[i].y1;
        let lineWidth = lines[i].x2 - lines[i].x1;
        // Bounce Ball
        ///vertically
        this.yVelocity = this.yVelocity * -0.25;
        ///horizontally (if line in opposite direction)
        if ((this.prevLineDirection * lineWidth) < 0) {
          this.xVelocity = 0;         
        }
        
        // Reduces gravity depending on slope (vertical distance)
        let lowGravity = gravity - ((gravity * 100) / (lineHeight/2 + 100));
        // Increases x & y velocities by reduced gravity 
        this.xVelocity += lowGravity * this.prevLineDirection;
        this.yVelocity += lowGravity;   

        this.prevLineDirection = lineWidth / Math.abs(lineWidth);
        
        
      } else {
        // Elliminates collision
        this.lineCollision = false;
      }
    }
    this.checkCanvas();
  }
  
  // Reduce life if player exits the canvas
  checkCanvas(){
    if(this.x >= width || this.x <= 0 || this.y >= height || this.y <= 0){
      setLevel(false);
    }
  }
}

class Line {
  constructor (){
    this.xA = mouseX;
    this.yA = mouseY;
    this.xB;
    this.yB;
    this.x1;
    this.y1;
    this.x2;
    this.y2;
    this.drawLine = false;
    this.brightness = 75;
    this.brightnessDirection = 0.5;
  }
  
  draw() {
    if (!this.drawLine) {
      // Shows line preveiew before line is drawn
      this.xB = mouseX;
      this.yB = mouseY;
    } else {
      if (this.yA < this.yB) {
        this.x1 = this.xA, this.y1 = this.yA, this.x2 = this.xB, this.y2 = this.yB;
      } else {
        this.x1 = this.xB, this.y1 = this.yB, this.x2 = this.xA, this.y2 = this.yA;
      }
    }
    push();
    colorMode(HSB, 100, 100, 100);
    stroke(0, 100, this.brightness);
    this.brightness += this.brightnessDirection;
    if (this.brightness >= 100 || this.brightness <= 75) {
      this.brightnessDirection *= -1;
    }
    line(this.xA, this.yA, this.xB, this.yB);
    pop();
  }
} 

class Target {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = targetImageWidth;
    this.height = targetImageHeight;
    this.velocity = 0;
  }
  
  draw() {
    image(targetImage, this.x, this.y, this.width, this.height);
    this.y -= this.velocity;
    this.checkCollision();
  }

  checkCollision() {
    // Ends game if playerObject collides with Target
    if(collideRectCircle(this.x + playerObject.r, this.y + playerObject.r, this.width - playerObject.r*2, this.height - playerObject.r, playerObject.x, playerObject.y, playerObject.r)) {
        setLevel(true);      
    }
  }
}

class Obstacle {
  constructor (x, y, obstacleWidth, obstacleHeight, xVelocity, yVelocity){
    this.x = x;
    this.y = y;
    this.width = obstacleWidth;
    this.height = obstacleHeight;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.brightness = 75;
    this.brightnessChange = 0.1;
    this.hue = 0;
  }
  draw(){
    colorMode(HSB, 100, 100, 100);
    fill(this.hue, 100, this.brightness);
    this.hue += 0.01;
    this.brightness += this.brightnessChange;
    if (this.hue >= 100) {
      this.hue = 0;
    }
    if (this.brightness >= 100 || this.brightness <= 75) {
      this.brightnessChange *= -1;
    }
    strokeWeight(1);
    rect(this.x, this.y, this.width, this.height);
    
    // Move Obstacles
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    
    // Check Collisions
    this.checkCollisions();
  }
  
  checkCollisions(){
    //collideRectCircle(x1, y1, width1, height1, cx, cy, diameter)
    // Collision with PlayerObject
    if(collideRectCircle(this.x + playerObject.r, this.y + playerObject.r, this.width, this.height, playerObject.x, playerObject.y, playerObject.r - 5) && level != 0) {
      setLevel(false);
    }
    
    // Collisions with Canvas
    if (this.xVelocity != 0 && (this.x < 0 || this.x > width - this.width)) {
      this.xVelocity *= -1;
    } 
    if (this.yVelocity != 0 && (this.y < 0 || this.y > height - this.height)) {
      this.yVelocity *= -1;
    }
  }
}

function displayText() {
  fill(255);
  textStyle(BOLD);
  if (level === 0) {
    textAlign(CENTER);
    push();
    textSize(60);
    textFont('Press Start 2P');
    text("SPACEBALLS", width/2, 125);
    pop();
    
    push();
    textSize(20);
    text("Instructions:", width/2, 175);
    pop();
    text("1. Draw lasers to get the supplies to the spacecraft", width/2, 205);
    text("2. Watch out for glowing obstacles", width/2, 230);
    text("3. Press any key to drop the supplies", width/2, 255);
    text("Press any key to play", width/2, 300);
  } else if (level > 0) {
    // Displays Instructions on Level 1
    if (level === 1 && !movePlayerObject) {
      text("Press any key to release the supplies", width/2, height/2);
    }
    // Displays Lives & Level
    text(`Lives: ${lives}`, width/2 + 5, 20);
    text(`Level: ${level} |`, width/2 - 50, 20);
    // Draw Time 
    text(`Time: ${round(time)}`, width - 75, 20);
    
    if (!gameOn) {
      textSize(15);
      text("GAME COMPLETE", width/2, height/2)
    }
    
  } else if (level === -1 ) {
    textSize(15); 
    text("GAME OVER", width/2, height/2)
  }
}

// Resets current level or sets-up next level depending on passLevel boolean
function setLevel(passLevel) {
  
  // Resets level
  movePlayerObject = false;
  playerObject.xVelocity = 0;
  playerObject.yVelocity = 0;
  playerObject.lineCollision = false;
  lines = [];
  
  // Incriment level or decriment lives
  if (passLevel) {
    level++;
  } else {
    lives--;
    // Ends game if no lives remaining
    if (lives <= 0) {
      level = -1;
    }
  }
  
  // Level-specific Set-up:
  if (level === 1) {
    // Change Background
    backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2F8v8v_z9ee_180214.jpg?v=1628195516768");
    
    // Move Player Object
    playerObject.x = 50
    playerObject.y = 75;   
    
    // Create New Obstacle
    obstacles = [];
    obstacles.push(new Obstacle(width/5, height - height/5, width/2, height/5, 0, -1));
  
    // Create Target Object
    targetObject = new Target(width - targetImageWidth - 10, height - targetImageHeight);
  }
  
  else if (level === 2) {
    // Change Background
    backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2Fwm8e_11hf_180214.jpg?v=1628195513021");
    
    // Move Player Object
    playerObject.x = 50
    playerObject.y = 75;       

    // Create New Obstacles
    obstacles = [];
    obstacles.push(new Obstacle(width / 4.5, height - height/2, width/12, height/2, 0, -1));
    obstacles.push(new Obstacle(width/1.7, 0, obstacles[0].width, obstacles[0].height, 0, 1));
  } 
  
  else if (level === 3){
    // Change Background
    backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2F5mpi_fkmz_180214.jpg?v=1628195516465");
    
    // Move Player Object
    playerObject.x = 50;
    playerObject.y = 75;   
    
    // Create New Obstacles
    obstacles = [];
    obstacles.push(new Obstacle(width/200, height / 4, width /2.2, height / 20, 0, 0)); // Top Left Line
    obstacles.push(new Obstacle(width - (width/1.5), height / 2, width/1.5, height / 20, 0, 0)); // Bottom Right Line
    obstacles.push(new Obstacle(0, height - height/5 - 10, width/6, height/5, 1, 0)); // Bottom rectangle
  }
  
  else if (level === 4){
    // Change Background
    backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2F37wy_ca9s_180214.jpg?v=1628195514718");
    
    // Move Player Object
    playerObject.x = 50;
    playerObject.y = 75;    
    
    // Create New Obstacles
    obstacles = [];
    obstacles.push(new Obstacle(width/2 - targetImageWidth /2 - 10, height / 3, targetImageWidth + 20, height / 20, 0, 0));
    obstacles.push(new Obstacle(width/2.5 - targetImageWidth /2, height - targetImageHeight*2, height / 20, targetImageHeight * 1.8, 0, -1));
    obstacles.push(new Obstacle(width/1.5 - targetImageWidth /2, 0, height / 20, targetImageHeight, 0, 1));
    
    // Move Target
    targetObject.x = width/2 - targetImageWidth/2;
    targetObject.y = height/2.3;
  }
  
  else if (level === 5){
    // Change Background
    backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2Fbvpl_1ti0_180214.jpg?v=1628195514865");
    
    // Move Player Object
    playerObject.x = 50;
    playerObject.y = 75;  
    
    // Create New Obstacles
    obstacles = [];
    obstacles.push(new Obstacle(width/2 - targetImageWidth /2, height / 4.5, width / 5.5, height / 20, 2, 0));
    obstacles.push(new Obstacle(width/3.3 - targetImageWidth /2, height / 4.5, height / 20, width / 5.5, 0, -1.2));
    obstacles.push(new Obstacle(width/2 - targetImageWidth / 2, height / 2, width / 2.5, height / 20, 0, 0));
    obstacles.push(new Obstacle(width/2 - targetImageWidth /2, height / 2, height / 20, height / 2, 0, 0));
    
    // Move the Target
    targetObject.x = width/1.3 ;
    targetObject.y = height/1.5;
  }
  
  // Splash Screen
  else if (level === 0) {
    backgroundImage = loadImage("    https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2Fstars.jpg?v=1628187745045");
  }
  
  // Losing/Winning Screen
  else {
    gameOn = false;
    
    // Change Background
    if (level === -1) {
      backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2Fp7t0_tcrw_180214.jpg?v=1628198729878");
    } else {
      backgroundImage = loadImage("https://cdn.glitch.com/0abf573f-6c17-4b21-8463-96c028064f3f%2Fg5m3_z5oc_180214.jpg?v=1628195516175");
    }
    
    // Delete Objects
    playerObject = new Player();
    obstacles = [];
    
    // Move targetObeject off Screen
    targetObject.y = height;
    
  }
}