const flapSound = new Audio("https://dl.dropbox.com/s/gmvw0os6z2z8xej/sfx_swooshing.mp3?dl=0");
    const scoreSound = new Audio("https://dl.dropbox.com/s/vupnrhb1sb4q0h5/mario-coin-sound-effect.mp3?dl=0");

    flapSound.oncanplaythrough = assetLoaded;
    scoreSound.oncanplaythrough = assetLoaded;

    // Preload sounds by playing and pausing immediately
    flapSound.load();
    scoreSound.load();

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const finalScore = document.getElementById("finalScore");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const loader = document.getElementById("loader");
    const loaderOverlay = document.getElementById ("loaderOverlay");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Show loader while loading images
    loader.style.display = "block";
    startButton.style.display = "none";

    // Load Images
    const backgroundImage = new Image();
    backgroundImage.src = "https://i.imghippo.com/files/IFg2801E.webp";
    backgroundImage.onload = assetLoaded;

    const pipeImage = new Image();
    pipeImage.src = "https://i.imghippo.com/files/rrF8629Nd.png";
    pipeImage.onload = assetLoaded;

    const birdImage = new Image();
    birdImage.src = "https://i.imghippo.com/files/xCrN5256ehA.png";
    birdImage.onload = assetLoaded;

    // Wait for all images to load


    let bird = { x: 50, y: canvas.height / 2, width: 40, height: 30, dy: 0 };
    let pipes = [];
    let pipeWidth = 50;
    let pipeGap = 150;
    let gravity = 0.25;
    let jumpStrength = -4.5;
    let score = 0;
    let gameActive = false;
    let pipeInterval = 90;

    function startGame() {
      if (!gameActive) {
        resetGame();
        gameActive = true;
        scoreDisplay.style.display = "block";
        startButton.style.display = "none";
        overlay.style.visibility = "hidden";
        
        canvas.style.filter = "none";
        gameLoop();
      }
    }

    let pipeHorizontalGap = 250;

    function gameLoop() {
      if (gameActive) {
        // Draw background
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Bird mechanics
        bird.dy += gravity;
        bird.y += bird.dy;

        // Draw bird
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

        // Pipe mechanics
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeHorizontalGap) {
          const minPipeHeight = canvas.height * 0.2;
          const maxPipeHeight = canvas.height * 0.6;
          const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
          const randomGap = Math.floor(Math.random() * (150 - 100 + 1)) + 90;
          const bottomPipeHeight = pipeHeight + randomGap;
          pipes.push({ x: canvas.width, y: pipeHeight, gap: randomGap, bottomY: bottomPipeHeight });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].x -= 2;
          if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
            scoreDisplay.textContent = "Score: " + score;
            scoreSound.currentTime = 0;
            scoreSound.play();
          } else {
            ctx.drawImage(pipeImage, pipes[i].x, pipes[i].bottomY, pipeWidth, canvas.height - pipes[i].bottomY);
            ctx.save();
            ctx.translate(pipes[i].x + pipeWidth, pipes[i].y);
            ctx.rotate(Math.PI);
            ctx.drawImage(pipeImage, 0, 0, pipeWidth, pipes[i].y);
            ctx.restore();

            if (
              bird.x < pipes[i].x + pipeWidth &&
              bird.x + bird.width > pipes[i].x &&
              (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].bottomY)
            ) {
              if (navigator.vibrate) navigator.vibrate(50);
              endGame();
            }
          }
        }

        if (bird.y + bird.height > canvas.height || bird.y < 0) endGame();
        requestAnimationFrame(gameLoop);
      }
    }

    function jump() {
      if (gameActive) bird.dy = jumpStrength;
      flapSound.currentTime = 0;
      flapSound.play();
    }

    function endGame() {
      gameActive = false;
      overlay.style.visibility = "visible";
      finalScore.textContent = "Final Score: " + score;
    }

    function restartGame() {
      startGame();
    }

    function resetGame() {
      bird = { x: 50, y: canvas.height / 2, width: 40, height: 30, dy: 0 };
      pipes = [];
      score = 0;
      pipeInterval = 90;
      scoreDisplay.textContent = "Score: 0";
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (!gameActive) startGame();
        jump();
      }
    });
    canvas.addEventListener("click", () => { if (gameActive) { jump(); } });

    let assetsLoaded = 0;
    const totalAssets = 5; // 3 images + 2 sounds

    function assetLoaded() {
      assetsLoaded++;
      if (assetsLoaded === totalAssets) {
        loader.style.display = "none"; // Hide loader
        startButton.style.display = "block";
         loaderOverlay.style.visibility = "hidden";// Show start button
      }
    }
