const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Variables
let mvspeed = 5;
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let obstacles = [];
let gameSpeed;
let keys = {};


// Event Listeners
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor (x, y, width, height, color, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.id =id;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }

  Animate () {
    try {
      if (keys['KeyS']){
        if(this.y + this.height < canvas.height){
          this.y += mvspeed;
        }
      }
  
      if (keys['KeyW']){
        if(this.y > 0){
          this.y -= mvspeed;
        } 
      }
    } catch (err) {
      alert("Player " + this.id + " bugou!");
    }

    this.Draw();
  }

  Animate2 () {
    try {
      if (keys['ArrowDown']){
        if(this.y + this.height < canvas.height){
          this.y += mvspeed;
        }
      }
  
      if (keys['ArrowUp']){
        if(this.y > 0){
          this.y -= mvspeed;
        } 
      }
    } catch (err) {
      alert("Player " + this.id + " bugou!");
    }
    
    this.Draw();
  }
}

class Obstacle {
  constructor (x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.dx = -gameSpeed;
  }

  Update () {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }
}

// Game Functions
function SpawnObstacle () {
  let size = RandomIntInRange(20, 70);
  let type = RandomIntInRange(0, 1);
  let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}

class Text {
  constructor (t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

// Game Functions
function SpawnObstacle () {
  let size = RandomIntInRange(20, 70);
  let type = RandomIntInRange(0, 1);
  let height = RandomIntInRange(0, canvas.height - size);
  let obstacle = new Obstacle(canvas.width + size, height, size, size, 'yellow');

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}

function RandomIntInRange (min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Animation Rendering
let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update () {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    spawnTimer = initialSpawnTimer - gameSpeed * 8;
    
    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // Spawn Enemies
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
    }

    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.heigth &&
      player.y + player.heigth > o.y ||
      player2.x < o.x + o.width &&
      player2.x + player2.width > o.x &&
      player2.y < o.y + o.heigth &&
      player2.y + player2.heigth > o.y
    ) {
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
      window.localStorage.setItem('highscore', highscore);
    }

    o.Update();
  }

  // Render Players
  player.Animate();
  player2.Animate2();

  // final
  score++;
  scoreText.t = "Score: " + score;
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }
  
  highscoreText.Draw();

  gameSpeed += 0.005;
  mvspeed += 0.005

}

// Main
function Start () {
  alert("indicar quem bateu;\nquando Perde;\nDetectar Colisão;\n sprites!")
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif";
  gameSpeed = 10;

  //Score Section
  score = 0;
  highscore = 0;
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }

  //Create Player
  player = new Player(25, 100, 50, 50, 'red', 1);
  player2 = new Player (100, 25, 50, 50, 'blue', 2);

  // Create Scores Objects
  scoreText = new Text("Score: " + score, 25, 25, "left", "white", "20");
  highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "white", "20");

  requestAnimationFrame(Update);
}

Start();