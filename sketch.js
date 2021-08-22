var player, playerImg;
var edges, ground, groundImg;
var enemy, enemy1Img, enemy2Img, enemy3Img, enemyGroup;
var chicken, chickenImg, chickenGroup;
var gameState = "play";
var invisibleGround;
var playerEnd;
var coin, coinImg, coinGroup, coinEnd;
var score;
var coinSound, hitSound;
var restart, restartImg;
var gameOver, gameOverImg;
var playerStanding;
var pole, poleImg, poleGroup;
var chest, chestImg, chestGroup;


function preload() {
  playerImg = loadAnimation("images/pc_walking1.png",
    "images/pc_walking2.png", "images/pc_walking3.png", 
    "images/pc_walking4.png",  "images/pc_walking5.png", 
    "images/pc_walking6.png", "images/pc_walking7.png",
    "images/pc_walking8.png", "images/pc_walking9.png");

  playerEnd = loadAnimation("images/pc_slide.png");
  playerStanding = loadAnimation("images/pc_idle.png")

  groundImg = loadImage("images/grassy_background.png");

  enemy1Img = loadImage("images/goblin.png");
  enemy2Img = loadImage("images/armoured_goblin.png");
  enemy3Img = loadImage("images/slime.png");
  poleImg = loadImage("images/pole.png");
  chestImg = loadImage("images/chest.png");

  chickenImg = loadImage("images/chicken.png");

  restartImg = loadImage("images/restart.png");

  gameOverImg = loadImage("images/game_over.png");

  coinImg = loadAnimation("images/coin1.jpg", "images/coin2.jpg",
                          "images/coin3.jpg", "images/coin4.jpg");
  
  coinEnd = loadAnimation("images/coin1.jpg");   
  
  coinSound = loadSound("Sound/coin.wav");
  hitSound = loadSound("Sound/hit.mp3");

  coinGroup = new Group();
  enemyGroup = new Group();
  chickenGroup = new Group();
  poleGroup = new Group();
  chestGroup = new Group();
}

function setup() {
  createCanvas(790, 700);
  
  ground = createSprite(500, 350, 1000, 700);
  ground.addImage(groundImg);

  invisibleGround = createSprite(350, 575, 900, 20);
  invisibleGround.visible = false;

  player = createSprite(100, 500, 75, 75);
  player.addAnimation("running", playerImg);
  player.addAnimation("ended", playerEnd);
  player.addAnimation("standing", playerStanding);
  // player.velocityX = 6;
  player.scale = 1.7;

  gameOver = createSprite(400, 230);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5
  gameOver.visible = false

  restart = createSprite(400, 350);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false

  edges = createEdgeSprites();
  score = 0;

}

function draw() {
  background(0); 
  if (gameState === "play") {

    ground.velocityX = -6;
    ground.scale = 5;
  

  if (ground.x < 0) {
    ground.x = width / 2;
  }

  if (keyDown("space") && player.y >= 400) {
    player.velocityY = -10
  }

  if (keyDown("right")) {
    player.x += 6;
  }

  if (keyDown("left")) {
    player.changeAnimation("standing", playerStanding);
    player.x -= 6;
  }

  else {
    player.changeAnimation("running", playerImg);
  }

  player.velocityY += 0.8; 
  player.collide(invisibleGround);
  player.collide(edges);
  spawnChicken();
  spawnEnemies();
  spawnCoin();
  spawnPole();
  spawnChest();
  
  if (coinGroup.isTouching(player)) {
    coinSound.play();
    coinGroup.destroyEach();
    score = score + 5;
  }

  if (chestGroup.isTouching(player)) {
    coinSound.play();
    chestGroup.destroyEach();
    score = score + 20
  }

  if (enemyGroup.isTouching(player)||poleGroup.isTouching(player)) {
    hitSound.play();
    gameState = "end";
  }


  }

  else if (gameState === "end") {
    gameOver.visible = true
    restart.visible = true
    ground.velocityX = 0;
    player.velocityX = 0;
    player.velocityY = 0;
    player.changeAnimation("ended", playerEnd);

    coin.changeAnimation("coinEnded", coinEnd);

    enemyGroup.setVelocityXEach(0);
    enemyGroup.setLifetimeEach(-1);

    chickenGroup.setVelocityXEach(0);
    chickenGroup.setLifetimeEach(-1);

    coinGroup.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);

    poleGroup.setLifetimeEach(-1);
    poleGroup.setVelocityXEach(0);

    chestGroup.setVelocityXEach(0);
    chestGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();

  fill("white");
  textSize(18);
  stroke("black");
  text("Score: " + score, 40, 40);
}

function spawnEnemies() {
  if (frameCount %160 === 0) {
    enemy = createSprite(980, 550, 50, 50);
    enemy.velocityX = -6;
    var rand = Math.round(random(1, 3));
    switch(rand) {
      case 1: enemy.addImage(enemy1Img);
      break
      case 2: enemy.addImage(enemy2Img);
      break
      case 3: enemy.addImage(enemy3Img);
      break;
      default: break;
    }
    enemy.lifetime = 180;
    enemyGroup.add(enemy);

  }
}

function spawnChicken() {
  if (frameCount %300 === 0) {
  chicken = createSprite(1000, 550, 50, 50);
  chicken.addImage(chickenImg);
  chicken.velocityX = -4;
  chickenGroup.add(chicken);
  }
}

function spawnCoin() {
  if (frameCount % 100 === 0) {
    coin = createSprite(700, random(350, 550), 10, 10);
    coin.addAnimation("goal", coinImg);
    coin.addAnimation("coinEnded", coinEnd);
    coin.velocityX = -6;
    coin.scale = 0.6;
    coinGroup.add(coin);
  }
}

function reset() {
  gameState = "play";
  restart.visible = false
  gameOver.visible = false

  chickenGroup.destroyEach()
  coinGroup.destroyEach()
  enemyGroup.destroyEach()
  poleGroup.destroyEach()
  chestGroup.destroyEach()

  player.changeAnimation("running", playerImg);
  score = 0
}

function spawnPole() {
  if (frameCount %300 === 0) {
    pole = createSprite(980, 500, 50, 50);
    pole.addImage(poleImg);
    pole.velocityX = -6;
    pole.scale = 0.8;
    poleGroup.add(pole);
  }
}

function spawnChest() {
  if (frameCount %700 === 0) {
    chest = createSprite(980, random(400, 430), 50, 50);
    chest.addImage(chestImg);
    chest.velocityX = -6;
    chest.scale = 0.4;
    chestGroup.add(chest);
  }
}