//Move the catcher with the left and right arrow keys to catch the falling objects. 

/* VARIABLES */
let catcher, fallingObject;
let score = 0;
let gameState = "waiting";
let startButton;
let timeout;

/* PRELOAD LOADS FILES */
function preload(){
  song = loadSound("assets/daisyCircuit.mp3");
  youLose = loadSound("assets/youLose.mp3");
  youWin = loadSound("assets/youWin.mp3");
  startScreen = loadSound("assets/startScreen.mp3");
  yoshiTongue = loadSound("assets/yoshiTongue.mp3");
  
  openMouth = loadImage("assets/openMouth.png");
  closedMouth = loadImage("assets/closedMouth.png");
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400,400);
  background("#90D5FF");

  // Create start button
  startButton = new Sprite (width/2, height/2);
  
  //Create catcher 
  catcher = new Sprite(-200,-380,100,20);
  catcher.color = color(95,158,160);
  catcher.collider = 'k';
  catcher.image= closedMouth
  
  //Create falling object
  fallingObject = new Sprite(-100,-100,10);
  fallingObject.color = color(0,128,128);
  fallingObject.vel.y = 0;
  fallingObject.image='assets/fallingFish.png';

  startScreen.play();
}
    
/* DRAW LOOP REPEATS */
function draw() {
  // Display start button
  startButton.w = 200;
  startButton.h = 50;
  startButton.collider = "k";
  startButton.color = "orange";
  startButton.text = "Start the game?";

  // Check if pressed
  if (startButton.mouse.presses()) {
    song.play();
    startScreen.stop();
    startButton.pos = {x:-100, y:-100};
    gameState = "playing";
    catcher.pos = {x:200, y: 380};
    fallingObject.pos = {x:10, y:0};
    fallingObject.vel.y = 5;
  }
  
  if (gameState == "playing") {
  background('#90D5FF');
  // Draw directions to screen
  fill(0,128,128);
  textSize(12);
  text("Move the \nbucket with the \nleft and right \narrow keys to \ncatch the falling \nfish.", width-100, 20);

  // If fallingObject reaches bottom, move back to random position at top
  if (fallingObject.y >= height) {
    fallingObject.y = 0;
    fallingObject.x = random(width);
    fallingObject.vel.y = random(5,55);
    score -= 1;
  }

  // Move catcher
  if (kb.pressing("left")) {
    catcher.vel.x = -15;
  } else if (kb.pressing("right")) {
    catcher.vel.x = 15;
  } else {
    catcher.vel.x = 0;
  }

  // Stop catcher at edges of screen
  if (catcher.x < 50) {
    catcher.x = 50;
  } else if (catcher.x > 350) {
    catcher.x = 350;
  }

  // If fallingObject collides with catcher, move back to a random position at the top
  if (fallingObject.collides(catcher)) {
    catcher.image = openMouth
    timeout = setTimeout(switchImage, 50);
    fallingObject.y = 0;
    fallingObject.x = random(width);
    fallingObject.vel.y = random(5,10);
    fallingObject.direction = 'down';
    score += 1; 
    if (score == 15) {
      gameState = "won";
      youWin.play();
      catcher.pos = {x:-100,y:-100};
      fallingObject.pos = {x:-200,y:-200};
    }
  }

  // Display the score
  fill(0,128,128);
  textSize(20);
  text("Score = " +score,10,30);
  
  // Check for lose condition
  if (score < 0) {
    gameState = "lost";
    youLose.play();
  }
  }
  
  // Handle win and lose screens
  ifWin();
  ifLose();
}

// Win Screen
function ifWin() {
  if (gameState == "won") {
    background("#FFD1DC");
    catcher.x = -100;
    catcher.y = -100;
    fallingObject.x = -200;
    fallingObject.y = -200;
    fill(0);
    textAlign(CENTER);
    text("You win! \nClick to replay :D", width/2, height/2);
    textAlign(LEFT);
    song.stop();
    youLose.stop();
    
    if (mouseIsPressed) {
      restart();
    }
    return true;
  }
}

function ifLose() {
  if (score < 0) {
    gameState = "lost";
    background("#950606");
    catcher.x = -100;  
    catcher.y = -100;
    fallingObject.x = -200;
    fallingObject.y = -200;
    fill("#FFFFFF");
    textAlign(CENTER);
    text("You lose :( \nClick to replay", width/2, height/2);
    textAlign(LEFT);
    song.stop();
    youWin.stop();

    if (mouseIsPressed) {
      restart();
    }
    return true;
  }
}

function restart() {
  gameState = "playing";
  song.play();
  youWin.stop();
  youLose.stop();
  score = 0;
  catcher.x = 200;
  catcher.y = 380;
  catcher.vel.x = 0;
  fallingObject.x = random(width);
  fallingObject.y = 0;
  fallingObject.vel.y = 5;
}

function switchImage() {
  yoshiTongue.play();
  if (catcher.image == closedMouth) {
    catcher.image = openMouth;
  } else if (catcher.image == openMouth) {
    catcher.image = closedMouth;
  }
}