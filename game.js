const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dinoImg = document.getElementById("dinoImage");
const cactusImg = document.getElementById("cactusImage");
const birdImg = document.getElementById("birdImage");
let bgX = 0;

let dino = { x: 50, y: 150, width: 48, height: 48, vy: 0, gravity: 2, jumpPower: -25, isJumping: false };
let cactus = { x: 800, y: 160, width: 20, height: 40 };
let bird = { x: 1200, y: 100, width: 40, height: 30 };
let score = 0;
let gameOver = false;
let gameStarted = false;
let speed = 8;
let cactusCooldown = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) {
      resetGame();
      gameStarted = true;
      loop();
    } else if (gameOver) {
      resetGame();
      loop();
    } else if (!dino.isJumping) {
      dino.vy = dino.jumpPower;
      dino.isJumping = true;
    }
  }
});

function resetGame() {
  gameStarted = true;
  gameOver = false;
  cactus.x = 800;
  bird.x = 1200;
  score = 0;
  speed = 8;
  dino.y = 150;
  cactusCooldown = Math.random() * 150 + 100;
}

function update() {
  // ジャンプ処理
  dino.y += dino.vy;
  dino.vy += dino.gravity;
  if (dino.y >= 150) {
    dino.y = 150;
    dino.vy = 0;
    dino.isJumping = false;
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


  // 地面
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, 190);
  ctx.lineTo(800, 190);
  ctx.stroke();

  // 恐竜
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

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

// スマホ用のタップ操作に対応
canvas.addEventListener("touchstart", () => {
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
});

// リサイズ時にcanvasサイズを調整（見た目だけ）
function resizeCanvas() {
  const ratio = 800 / 200;
  const w = canvas.clientWidth;
  const h = w / ratio;
  canvas.style.height = h + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
