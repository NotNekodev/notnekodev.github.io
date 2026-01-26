export function initGame(container) {
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    container.innerHTML = `
    <canvas id="game-canvas" style="background:#222; display:block; width:100%; height:100%;"></canvas>
    <div id="game-score" style="
        color:#fff;
        font-family:sans-serif;
        position:absolute;
        top:35px;
        left:35px;       /* moved from right to left */
        z-index:1000;
        font-size:16px;
    ">Score: 0</div>
  `;

    const canvas = container.querySelector('#game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDiv = container.querySelector('#game-score');

    let player, keys, blocks, blockSpeed, spawnInterval, score, gameOver;

    function initState() {
        player = { x: 0.5, y: 0.9, w: 0.1, h: 0.1, speed: 0.02 };
        keys = {};
        blocks = [];
        blockSpeed = 0.0175;
        spawnInterval = 1000;
        score = 0;
        gameOver = false;
    }

    initState();

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', e => {
        keys[e.key] = true;

        if (gameOver && e.code === 'Space') {
            initState();
        }
    });
    document.addEventListener('keyup', e => keys[e.key] = false);

    function spawnBlock() {
        const width = 0.05 + Math.random() * 0.15;
        const x = Math.random() * (1 - width);
        blocks.push({ x, y: -0.05, w: width, h: 0.05 });
    }

    setInterval(() => {
        if (!gameOver) spawnBlock();
    }, spawnInterval);

    function update() {
        if (gameOver) return;

        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x + player.w < 1) player.x += player.speed;

        blocks.forEach(b => b.y += blockSpeed);

        blocks.forEach(b => {
            if (
                player.x < b.x + b.w &&
                player.x + player.w > b.x &&
                player.y < b.y + b.h &&
                player.y + player.h > b.y
            ) {
                gameOver = true;
            }
        });

        blocks = blocks.filter(b => b.y < 1);
        score += 0.01;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x * canvas.width, player.y * canvas.height,
            player.w * canvas.width, player.h * canvas.height);

        ctx.fillStyle = '#f00';
        blocks.forEach(b => ctx.fillRect(b.x * canvas.width, b.y * canvas.height,
            b.w * canvas.width, b.h * canvas.height));

        scoreDiv.textContent = `Score: ${Math.floor(score)}`;

        if (gameOver) {
            ctx.fillStyle = '#fff';
            ctx.font = `${canvas.width / 15}px sans-serif`;
            ctx.fillText('GAME OVER', canvas.width / 2 - canvas.width / 6, canvas.height / 2);
            ctx.font = `${canvas.width / 25}px sans-serif`;
            ctx.fillText('Press Space to Restart', canvas.width / 2 - canvas.width / 6, canvas.height / 2 + 40);
        }
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
}
