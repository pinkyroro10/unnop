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

// ข้อความและสถานะการแสดงผล
let message = '';
let showMessageFlag = false;
let gameOverFlag = false;

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

// วาดข้อความและภาพ
function drawMessage() {
  if (showMessageFlag) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(50, canvas.height / 2 - 50, canvas.width - 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(message, 100, canvas.height / 2);

    // วาดภาพ KY.jpg
    if (score >= 5) {  // แสดงภาพเมื่อคะแนนได้ 5 ขึ้นไป
      const img = new Image();
      img.src = 'KY.jpg'; // ใช้ภาพ KY.jpg
      img.onload = () => {
        ctx.drawImage(img, 150, canvas.height / 2 + 10, 100, 100); // ปรับตำแหน่งและขนาดของรูป
      };
    }
  }
}

// ฟังก์ชันสำหรับแสดงข้อความเกมจบ
function showGameOver() {
  message = 'กระจอก: ' + score;
  showMessageFlag = true;
  gameOverFlag = true;
  
  setTimeout(() => {
    showMessageFlag = false;
    resetGame();  // เริ่มเกมใหม่หลังจากแสดงข้อความ 3 วินาที
  }, 3000);
}

// ฟังก์ชันเริ่มเกมใหม่
function resetGame() {
  score = 0;
  ball.y = 0;
  ball.x = Math.random() * (canvas.width - ball.size);
  gameOverFlag = false;
}

// เคลื่อนที่ของลูกบอล
function moveBall() {
  ball.y += ball.dy;

  // ถ้าลูกบอลหล่นไปข้างล่าง และยังไม่แสดงเกมจบ
  if (ball.y + ball.size > canvas.height && !gameOverFlag) {
    showGameOver();  // เรียกฟังก์ชันเกมจบ
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

    // แสดงข้อความและภาพเมื่อได้ 5 คะแนน
    if (score === 5) {
      message = 'ได้ 5 เองหรอ!';
      showMessageFlag = true;
      

      setTimeout(() => {
        showMessageFlag = false;
      }, 3000);
    }
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

  if (!gameOverFlag) {
    drawPlayer();
    drawBall();
    moveBall();
    updatePlayer();
  }

  drawScore();
  drawMessage(); // วาดข้อความและภาพ

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
