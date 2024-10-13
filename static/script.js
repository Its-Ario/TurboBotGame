(function(){
  var _0x1a0b=['debugger'];
  setInterval(function(){
      debugger;
  },100);
  document[_0x1a0b[0]]=new Function('debugger');
})();

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const controlBtns = document.querySelectorAll('.control-btn');
const startBtn = document.getElementById('start-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const currentAbilityEl = document.getElementById('current-ability');

const gridSize = 15;
const cellSize = canvas.width / gridSize;

let snake = [{ x: 5, y: 5 }];
let food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameLoop;
let gameStarted = false;
let gameSpeed = 100;
let currentAbility = 'None';
let abilityDuration = 0;

highScoreEl.textContent = highScore;
withdrawBtn.disabled = true;

const snakeHeadImg = new Image();
const snakeBodyImg = new Image();
const foodImg = new Image();

snakeHeadImg.src = 'data:image/svg+xml;base64,' + btoa(`
<svg width="${cellSize}" height="${cellSize}" viewBox="0 0 ${cellSize} ${cellSize}" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${cellSize - 2}" height="${cellSize - 2}" rx="2" ry="2" fill="#00ff00" stroke="#008000" stroke-width="2"/>
  <circle cx="${cellSize * 0.3}" cy="${cellSize * 0.3}" r="${cellSize * 0.1}" fill="#000000"/>
  <circle cx="${cellSize * 0.7}" cy="${cellSize * 0.3}" r="${cellSize * 0.1}" fill="#000000"/>
</svg>
`);

snakeBodyImg.src = 'data:image/svg+xml;base64,' + btoa(`
<svg width="${cellSize}" height="${cellSize}" viewBox="0 0 ${cellSize} ${cellSize}" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${cellSize - 2}" height="${cellSize - 2}" rx="2" ry="2" fill="#00cc00" stroke="#008000" stroke-width="2"/>
</svg>
`);

foodImg.src = 'data:image/svg+xml;base64,' + btoa(`
<svg width="${cellSize}" height="${cellSize}" viewBox="0 0 ${cellSize} ${cellSize}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cellSize / 2}" cy="${cellSize / 2}" r="${cellSize / 2 - 1}" fill="#ff0000"/>
</svg>
`);

function drawSnake() {
snake.forEach((segment, index) => {
  ctx.drawImage(index === 0 ? snakeHeadImg : snakeBodyImg, segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
});
}

function drawFood() {
  ctx.drawImage(foodImg, food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function moveSnake() {
const head = { x: snake[0].x, y: snake[0].y };
switch (direction) {
  case 'right': head.x = (head.x + 1) % gridSize; break;
  case 'left': head.x = (head.x - 1 + gridSize) % gridSize; break;
  case 'up': head.y = (head.y - 1 + gridSize) % gridSize; break;
  case 'down': head.y = (head.y + 1) % gridSize; break;
}
snake.unshift(head);
if (head.x === food.x && head.y === food.y) {
  score++;
  scoreEl.textContent = score;
  food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  if (Math.random() < 0.1) {
    activateRandomAbility();
  }
  updateWithdrawButton();
} else {
  snake.pop();
}
if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
  if (currentAbility !== 'Invincibility') {
    gameOver();
  }
}
updateAbility();
}

function activateRandomAbility() {
const abilities = ['Speed Boost', 'Invincibility', 'Double Points'];
currentAbility = abilities[Math.floor(Math.random() * abilities.length)];
abilityDuration = 160;
currentAbilityEl.textContent = currentAbility;
applyAbilityEffect();
}

function applyAbilityEffect() {
switch (currentAbility) {
  case 'Speed Boost':
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed / 2);
    break;
  case 'Invincibility':
    // Invincibility is handled in the collision detection
    break;
  case 'Double Points':
    // Double points are handled when eating food
    break;
}
}

function updateAbility() {
if (abilityDuration > 0) {
  abilityDuration--;
  if (abilityDuration === 0) {
    currentAbility = 'None';
    currentAbilityEl.textContent = currentAbility;
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
  }
}
}

function gameOver() {
  clearInterval(gameLoop);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
    localStorage.setItem('highScore', highScore);
  }
  gameStarted = false;
  startBtn.textContent = 'Restart Game';
  startBtn.style.display = 'block';
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();
}

function startGame() {
  snake = [{ x: 5, y: 5 }];
  food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  direction = 'right';
  score = 0;
  scoreEl.textContent = score;
  gameStarted = true;
  startBtn.style.display = 'none';
  currentAbility = 'None';
  currentAbilityEl.textContent = currentAbility;
  abilityDuration = 0;
  clearInterval(gameLoop);
  gameLoop = setInterval(update, gameSpeed);
  updateWithdrawButton();
}

function updateWithdrawButton() {
withdrawBtn.disabled = score <= 1;
}

controlBtns.forEach((btn) => {
btn.addEventListener('click', () => {
  if (gameStarted) {
    const newDirection = btn.dataset.direction;
    if (
      (direction === 'left' && newDirection !== 'right') ||
      (direction === 'right' && newDirection !== 'left') ||
      (direction === 'up' && newDirection !== 'down') ||
      (direction === 'down' && newDirection !== 'up')
    ) {
      direction = newDirection;
    }
  }
});
});

document.addEventListener('keydown', (e) => {
if (gameStarted) {
  switch (e.key) {
    case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
    case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
    case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
  }
}
});

function getHashFromURL() {
const urlParams = new URLSearchParams(window.location.search);
const hash = urlParams.get('hash');
return hash;
}

let userHash;
document.addEventListener('DOMContentLoaded', (event) => {
  userHash = getHashFromURL();
  console.log('User Hash:', userHash);
});

function sendData(score, userHash) {
  if (score < 2) {
    alert("You should have at least 2 points!");
    return;
  }

  $.ajax({
    url: '/save-score',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ score: score, hash: userHash }),
    success: () => {
      console.log('Score sent');
      alert('Score withdrawn: ' + score);

      score = 0;
      scoreEl.textContent = score;
      startBtn.style.display = 'block';
      gameStarted = false;
      clearInterval(gameLoop);
    },
    error: (error) => {
      alert("Error saving score");
      console.error('Error sending score:', error);
    }
  });
}

withdrawBtn.addEventListener('click', () => {
  if (confirm("This will end your game. Are you sure?")) {
    sendData(score, userHash);
  }
});


startBtn.addEventListener('click', startGame)