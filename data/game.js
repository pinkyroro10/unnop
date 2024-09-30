const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ตั้งค่าขนาดของ canvas
canvas.width = 400;
canvas.height = 500;

// ตัวเล่น (player)
const player = {
  x: 180,
  y: 450,
  width: 40,
  height: 20,
  color: 'blue',
  dx: 0
};

// ลูกบอล (ball)
const ball = {
  x: Math.random() * (canvas.width - 20),
  y: 0,
  size: 10,
  color: 'rgba(0, 255, 0, 0.8)', // สีเขียว นีออน
  dy: 2
};

// คะแนน
let score = 0;

// วาดตัวเล่น
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// วาดลูกบอล
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// เคลื่อนที่ของลูกบอล
function moveBall() {
  ball.y += ball.dy;

  // ถ้าลูกบอลหล่นไปข้างล่าง จะสุ่มตำแหน่งใหม่
  if (ball.y + ball.size > canvas.height) {
    ball.y = 0;
    ball.x = Math.random() * (canvas.width - ball.size);
  }

  // ตรวจจับการชนกับตัวเล่น
  if (
    ball.y + ball.size > player.y &&
    ball.x > player.x &&
    ball.x < player.x + player.width
  ) {
    ball.y = 0;
    ball.x = Math.random() * (canvas.width - ball.size);
    score++;
  }
}

// วาดคะแนน
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// อัพเดตตัวเล่น
function updatePlayer() {
  player.x += player.dx;

  // ตรวจจับขอบซ้าย-ขวาของ canvas
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
}

// อัพเดตทุกเฟรม
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBall();
  moveBall();
  updatePlayer();
  drawScore();

  requestAnimationFrame(update);
}

// ควบคุมตัวเล่น
function moveLeft() {
  player.dx = -5;
}

function moveRight() {
  player.dx = 5;
}

function stopMove() {
  player.dx = 0;
}

// การตรวจจับการกดปุ่มบนแป้นพิมพ์
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    moveRight();
  }
});

document.addEventListener('keyup', () => {
  stopMove();
});

// เริ่มเกม
update();
