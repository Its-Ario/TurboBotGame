const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const controlBtns = document.querySelectorAll('.control-btn');

let snake = [{ x: 10, y: 10 }];
let food = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) };
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreEl.textContent = highScore;

function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#00ff00' : '#ffffff';
    ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
  });
}

function drawFood() {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case 'right':
      head.x = (head.x + 1) % 30;
      break;
    case 'left':
      head.x = (head.x - 1 + 30) % 30;
      break;
    case 'up':
      head.y = (head.y - 1 + 30) % 30;
      break;
    case 'down':
      head.y = (head.y + 1) % 30;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) };
  } else {
    snake.pop();
  }
  if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
    resetGame();
  }
}


function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) };
  direction = 'right';
  score = 0;
  scoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
    localStorage.setItem('highScore', highScore);
  }
}


function gameLoop() {
  drawSnake();
  drawFood();
  moveSnake();
  requestAnimationFrame(gameLoop);
}

controlBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    direction = btn.dataset.direction;
  });
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      direction = 'right';
      break;
    case 'ArrowLeft':
      direction = 'left';
      break;
    case 'ArrowUp':
      direction = 'up';
      break;
    case 'ArrowDown':
      direction = 'down';
      break;
  }
});

gameLoop();