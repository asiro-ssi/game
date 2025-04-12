const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dinoRun1 = document.getElementById("dinoRun1");
const dinoRun2 = document.getElementById("dinoRun2");
const dinoRun3 = document.getElementById("dinoRun3");
const dinoRun4 = document.getElementById("dinoRun4");
const cactusImg = document.getElementById("cactusImage");
const birdImg = document.getElementById("birdImage");

let bgX = 0;

let dino = {
  x: 50,
  y: 150,
  width: 48,
  height: 48,
  vy: 0,
  gravity: 2,
  jumpPower: -25,
  isJumping: false,
  frame: 0,
  frameCount: 0
};

let cactus = { x: 800, y: 160, width: 20, height: 40 };
let bird = { x: 1200, y: 100, width: 40, height: 30 };
let score = 0;
let gameOver = false;
let gameStarted = false;
let speed = 8;
let cactusCooldown = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    handleJump();
  }
});

canvas.addEventListener("touchstart", handleJump);
canvas.addEventListener("touchend", () => {}); // 防止連打処理などに応用可能

function handleJump() {
  if (!gameStarted) {
    resetGame();
    loop();
  } else if (gameOver) {
    resetGame();
    loop();
  } else if (!dino.isJumping) {
    dino.vy = dino.jumpPower;
    dino.isJumping = true;
  }
}

function resetGame() {
  gameOver = false;
  cactus.x = 800;
  bird.x = 1200;
  score = 0;
  speed = 8;
  dino.y = 150;
  dino.vy = 0;
  dino.isJumping = false;
  dino.frame = 0;
  dino.frameCount = 0;
  cactusCooldown = Math.random() * 150 + 100;
  gameStarted = true;
}

function update() {
  // 背景スクロール
  bgX -= speed / 2;
  if (bgX <= -canvas.width) {
    bgX = 0;
  }

  // ジャンプ処理
  dino.y += dino.vy;
  dino.vy += dino.gravity;
  if (dino.y >= 150) {
    dino.y = 150;
    dino.vy = 0;
    dino.isJumping = false;
  }

  // 恐竜走行アニメーション
  if (!dino.isJumping) {
    dino.frameCount++;
    if (dino.frameCount % 4 === 0) {
      dino.frame = (dino.frame + 1) % 4;
    }
  }

  // サボテン
  cactus.x -= speed;
  cactusCooldown -= speed;
  if (cactus.x < -cactus.width) {
    if (cactusCooldown <= 0) {
      cactus.x = 800 + Math.random() * 200;
      cactusCooldown = Math.random() * 150 + 100;
    }
  }

  // 鳥
  bird.x -= speed + 1;
  if (bird.x < -bird.width) {
    bird.x = 1000 + Math.random() * 300;
    bird.y = 80 + Math.random() * 60;
  }

  // 当たり判定（サボテン）
  if (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height &&
    dino.y + dino.height > cactus.y
  ) {
    gameOver = true;
  }

  // 当たり判定（鳥）
  if (
    dino.x < bird.x + bird.width &&
    dino.x + dino.width > bird.x &&
    dino.y < bird.y + bird.height &&
    dino.y + dino.height > bird.y
  ) {
    gameOver = true;
  }

  // スコアとスピードアップ
  score++;
  if (score % 100 === 0) {
    speed += 0.5;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景色
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 地面
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, 190);
  ctx.lineTo(800, 190);
  ctx.stroke();

  // 恐竜（走行アニメーション）
  const dinoImages = [dinoRun1, dinoRun2, dinoRun3, dinoRun4];
  const currentDinoImage = dinoImages[dino.frame];
  ctx.drawImage(currentDinoImage, dino.x, dino.y, dino.width, dino.height);

  // サボテン
  ctx.drawImage(cactusImg, cactus.x, cactus.y, cactus.width, cactus.height);

  // 鳥
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // スコア表示
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 650, 30);

  // メッセージ
  if (!gameStarted) {
    ctx.font = "28px sans-serif";
    ctx.fillText("スペースキーでスタート", 260, 100);
  }

  if (gameOver) {
    ctx.font = "14px sans-serif";
    ctx.fillText("Game Over / スペースで再開", 220, 120);
  }
}

function loop() {
  if (!gameOver && gameStarted) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    draw();
  }
}

// リサイズ対応
function resizeCanvas() {
  const ratio = 800 / 200;
  const w = canvas.clientWidth;
  const h = w / ratio;
  canvas.style.height = h + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
