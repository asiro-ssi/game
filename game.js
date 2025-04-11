const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dinoRun1 = document.getElementById("dinoRun1");
const dinoRun2 = document.getElementById("dinoRun2");
const cactusImg = document.getElementById("cactusImage");
const birdImg = document.getElementById("birdImage");

let frameCount = 0;

let dino = {
  x: 50,
  y: 150,
  width: 48,
  height: 48,
  vy: 0,
  gravity: 2,
  jumpPower: -25,
  isJumping: false,
  frame: 0
};

let cactus = { x: 800, y: 160, width: 20, height: 40 };
let bird = { x: 1200, y: 100, width: 40, height: 30 };

let score = 0;
let speed = 8;
let gameOver = false;
let gameStarted = false;
let cactusCooldown = 0;
let restartCooldown = 0; // game over後のクールタイム（連打防止）

function handleJump() {
  if (!gameStarted) {
    resetGame();
    loop();
  } else if (gameOver) {
    if (restartCooldown >= 30) {
      resetGame();
      loop();
    }
  } else if (!dino.isJumping) {
    dino.vy = dino.jumpPower;
    dino.isJumping = true;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    handleJump();
  }
});

canvas.addEventListener("touchstart", () => {
  handleJump();
});

function resetGame() {
  gameOver = false;
  gameStarted = true;
  restartCooldown = 0;
  cactus.x = 800;
  bird.x = 1200;
  score = 0;
  speed = 8;
  dino.y = 150;
  dino.vy = 0;
  cactusCooldown = Math.random() * 150 + 100;
}

function update() {
  dino.y += dino.vy;
  dino.vy += dino.gravity;
  if (dino.y >= 150) {
    dino.y = 150;
    dino.vy = 0;
    dino.isJumping = false;
  }

  // アニメーション（地上のみ）
  if (!dino.isJumping && frameCount % 6 === 0) {
    dino.frame = (dino.frame + 1) % 2;
  }

  cactus.x -= speed;
  cactusCooldown -= speed;
  if (cactus.x < -cactus.width) {
    if (cactusCooldown <= 0) {
      cactus.x = 800 + Math.random() * 200;
      cactusCooldown = Math.random() * 150 + 100;
    }
  }

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

  // game over時はクールダウン進める
  if (gameOver && restartCooldown < 30) {
    restartCooldown++;
  }

  frameCount++;
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
  const dinoImg = dino.frame === 0 ? dinoRun1 : dinoRun2;
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  // サボテン
  ctx.drawImage(cactusImg, cactus.x, cactus.y, cactus.width, cactus.height);

  // 鳥
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // スコア表示
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 650, 30);

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

// キャンバスサイズ調整
function resizeCanvas() {
  const ratio = 800 / 200;
  const w = canvas.clientWidth;
  const h = w / ratio;
  canvas.style.height = h + "px";
}

// 横向きチェック（スマホのみ）
function checkOrientation() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isLandscape = window.innerWidth > window.innerHeight;
  const rotateMessage = document.getElementById("rotateMessage");

  if (isMobile) {
    if (isLandscape) {
      rotateMessage.style.display = "none";
      canvas.style.display = "block";
      resizeCanvas();
    } else {
      rotateMessage.style.display = "flex";
      canvas.style.display = "none";
    }
  } else {
    rotateMessage.style.display = "none";
    canvas.style.display = "block";
    resizeCanvas();
  }
}

// イベント登録
window.addEventListener("resize", () => {
  resizeCanvas();
  checkOrientation();
});
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
