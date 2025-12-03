/*
Title:      Floater Ball
Author:     Drew D. Lenhart
Website:    https://github.com/dlenhart/floaterball
Date:       12-03-2025
Version:    0.2.2

Description:  Collect as many squares as possible within the time 
limit. Use the walls and other objects to your advantage.
*/


let game = null;
let timer = null;

let FLTR = {
    DAMPING: 0.97,
    SPEED_INCREMENT: 0.5,
    INITIAL_TIME: 30,
    TIMER_INTERVAL: 1000,
    INITIAL_LEVEL: 1,
    TOTAL_LEVELS: 30,
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,
    HEADER_HEIGHT: 20,
    BALL_RADIUS: 10,
    BALL_COLOR: "#ffffff",
    FOOD_WIDTH: 20,
    FOOD_HEIGHT: 20,
    FOOD_COLOR: "#6F7678",
    FOOD_STROKE_COLOR: "white",
    OBSTACLE_BASE_SIZE: 20,
    OBSTACLE_MAX_MULTIPLIER: 4,
    OBSTACLE_COLOR: "#000000",
    OBSTACLE_STROKE_COLOR: "white",
    OBSTACLE_STROKE_WIDTH: 4,
    TEXT_SIZE: 14,
    TEXT_COLOR: "green",
    TEXT_FONT: "Courier New",
    KEY_SHIFT: "Shift",
    KEY_SPACE: " ",
    KEY_LEFT: "ArrowLeft",
    KEY_UP: "ArrowUp",
    KEY_RIGHT: "ArrowRight",
    KEY_DOWN: "ArrowDown",

    xSpeed: 0,
    ySpeed: 0,
    y: 300,
    x: 300,
    foodXPos: 0,
    foodYPos: 0,
    obstacles: [],
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    pause: false,
    gamePaused: false,
    score: 0,
    canvas: null,
    ctx: null,
    timeLeft: 30,
    level: 1,
    debug: false,
    gameEnded: false,
    lastFrameTime: 0,
    levelTransition: false,
    levelScoreCount: 0,

    init: function () {
        try {
            FLTR.canvas = document.getElementsByTagName('canvas')[0];

            if (!FLTR.canvas) {
                throw new Error('Canvas element not found');
            }

            FLTR.canvas.width = FLTR.CANVAS_WIDTH;
            FLTR.canvas.height = FLTR.CANVAS_HEIGHT;
            FLTR.ctx = FLTR.canvas.getContext('2d');

            if (!FLTR.ctx) {
                throw new Error('Could not get 2D context from canvas');
            }
        } catch (error) {
            console.error('Initialization error:', error.message);
            alert('Failed to initialize game: ' + error.message);
        }
    },

    // Calculate time for current level
    // Level 1: 30s, Level 2-4: 29s, Level 5-7: 28s
    getLevelTime: function (level) {
        return Math.max(5, FLTR.INITIAL_TIME - Math.floor((level - 1) / 3));
    },

    getObstacleCount: function (level) {
        if (level < 2) return 0;
        return 3 + (level - 2);
    },

    rectanglesOverlap: function (x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
    },

    ballOverlapsRectangle: function (ballX, ballY, ballRadius, rectX, rectY, rectW, rectH) {
        // Find the closest point on the rectangle to the ball's center
        const closestX = Math.max(rectX, Math.min(ballX, rectX + rectW));
        const closestY = Math.max(rectY, Math.min(ballY, rectY + rectH));
        const distanceX = ballX - closestX;
        const distanceY = ballY - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        return distanceSquared < (ballRadius * ballRadius);
    },

    generateObstacles: function () {
        FLTR.obstacles = [];
        const obstacleCount = FLTR.getObstacleCount(FLTR.level);

        for (let i = 0; i < obstacleCount; i++) {
            let validPosition = false;
            let attempts = 0;
            let obstacle;

            while (!validPosition && attempts < 100) {
                const isHorizontal = Math.random() < 0.5;
                const sizeMultiplier = 1 + Math.random() * (FLTR.OBSTACLE_MAX_MULTIPLIER - 1);

                const width = isHorizontal ?
                    FLTR.OBSTACLE_BASE_SIZE * sizeMultiplier :
                    FLTR.OBSTACLE_BASE_SIZE;
                const height = isHorizontal ?
                    FLTR.OBSTACLE_BASE_SIZE :
                    FLTR.OBSTACLE_BASE_SIZE * sizeMultiplier;

                const x = Math.round((FLTR.CANVAS_WIDTH - width) * Math.random());
                const y = Math.round(FLTR.HEADER_HEIGHT + (FLTR.CANVAS_HEIGHT - FLTR.HEADER_HEIGHT - height) * Math.random());

                obstacle = {
                    x,
                    y,
                    width,
                    height
                };
                validPosition = true;

                for (let j = 0; j < FLTR.obstacles.length; j++) {
                    const existing = FLTR.obstacles[j];
                    if (FLTR.rectanglesOverlap(x, y, width, height, existing.x, existing.y, existing.width, existing.height)) {
                        validPosition = false;
                        break;
                    }
                }

                if (validPosition && FLTR.ballOverlapsRectangle(FLTR.x, FLTR.y, FLTR.BALL_RADIUS, x, y, width, height)) {
                    validPosition = false;
                }

                if (validPosition && FLTR.rectanglesOverlap(
                        FLTR.foodXPos, FLTR.foodYPos, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT,
                        x, y, width, height
                    )) {
                    validPosition = false;
                }

                attempts++;
            }

            if (validPosition) {
                FLTR.obstacles.push(obstacle);
            }
        }
    },

    obstacleCollision: function () {
        for (let i = 0; i < FLTR.obstacles.length; i++) {
            const obs = FLTR.obstacles[i];

            if (FLTR.ballOverlapsRectangle(FLTR.x, FLTR.y, FLTR.BALL_RADIUS, obs.x, obs.y, obs.width, obs.height)) {
                FLTR.xSpeed = -FLTR.xSpeed * 0.8;
                FLTR.ySpeed = -FLTR.ySpeed * 0.8;

                const centerX = obs.x + obs.width / 2;
                const centerY = obs.y + obs.height / 2;
                const dx = FLTR.x - centerX;
                const dy = FLTR.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    FLTR.x += (dx / distance) * 2;
                    FLTR.y += (dy / distance) * 2;
                }

                if (FLTR.debug) console.log("Obstacle collision");
                break;
            }
        }
    },

    update: function () {
        try {
            FLTR.checkKeys.move();
            FLTR.xSpeed *= FLTR.DAMPING;
            FLTR.ySpeed *= FLTR.DAMPING;

            FLTR.windowXCollision();
            FLTR.windowYCollision();
            FLTR.obstacleCollision();
            FLTR.foodCollision();

            FLTR.x += FLTR.xSpeed;
            FLTR.y += FLTR.ySpeed;

            FLTR.levelCheck();
        } catch (error) {
            console.error('Update error:', error.message);
        }
    },

    windowXCollision: function () {
        if (!FLTR.canvas) return;

        if (FLTR.x + FLTR.xSpeed - FLTR.BALL_RADIUS <= 0 ||
            FLTR.x + FLTR.xSpeed + FLTR.BALL_RADIUS >= FLTR.canvas.width) {
            FLTR.xSpeed = -FLTR.xSpeed;
            if (FLTR.debug) console.log(FLTR.canvas.width + " Position: " + FLTR.x);
        }
    },

    windowYCollision: function () {
        if (!FLTR.canvas) return;

        // Check collision, account for header bar
        if (FLTR.y + FLTR.ySpeed - FLTR.BALL_RADIUS < FLTR.HEADER_HEIGHT ||
            FLTR.y + FLTR.ySpeed + FLTR.BALL_RADIUS >= FLTR.canvas.height) {
            FLTR.ySpeed = -FLTR.ySpeed;
            if (FLTR.debug) console.log(FLTR.canvas.height + " Position: " + FLTR.y);
        }
    },

    foodCollision: function () {
        if (Math.round(FLTR.x) + FLTR.BALL_RADIUS > FLTR.foodXPos &&
            Math.round(FLTR.x) - FLTR.BALL_RADIUS < FLTR.foodXPos + FLTR.FOOD_WIDTH &&
            Math.round(FLTR.y) + FLTR.BALL_RADIUS > FLTR.foodYPos &&
            Math.round(FLTR.y) - FLTR.BALL_RADIUS < FLTR.foodYPos + FLTR.FOOD_HEIGHT
        ) {
            if (FLTR.debug) console.log("Food collision");
            FLTR.score++;
            FLTR.levelScoreCount++;
            FLTR.squares.random();
        }
    },

    levelCheck: function () {
        if (FLTR.timeLeft == 0 && FLTR.level !== FLTR.TOTAL_LEVELS) {
            // End game if a player hasn't collected in level
            if (FLTR.levelScoreCount == 0) {
                endGame();
                return;
            }

            if (!FLTR.levelTransition) {
                FLTR.levelTransition = true;
                FLTR.gamePaused = true;
                cancelAnimationFrame(game);
                clearInterval(timer);
                FLTR.draw();
            }
        } else if (FLTR.level == FLTR.TOTAL_LEVELS && FLTR.timeLeft == 0) {
            endGame();
        }

        return;
    },

    continueToNextLevel: function () {
        if (FLTR.levelTransition) {
            FLTR.levelTransition = false;
            FLTR.level = FLTR.level + 1;
            FLTR.timeLeft = FLTR.getLevelTime(FLTR.level);
            FLTR.levelScoreCount = 0;
            FLTR.generateObstacles();
            FLTR.squares.random();
            FLTR.gamePaused = false;
            game = requestAnimationFrame(FLTR.gameloop);
            timer = setInterval(updateTimer, FLTR.TIMER_INTERVAL);
        }
    },

    draw: function () {
        try {
            FLTR.character.clear();

            // black header bar
            FLTR.ctx.fillStyle = '#000000';
            FLTR.ctx.fillRect(0, 0, FLTR.CANVAS_WIDTH, 20);

            FLTR.obstacles.forEach(obs => {
                FLTR.squares.obstacle(obs.x, obs.y, obs.width, obs.height);
            });
            FLTR.character.circle(FLTR.x, FLTR.y, FLTR.BALL_RADIUS);
            FLTR.squares.food(FLTR.foodXPos, FLTR.foodYPos);

            // text on black bar
            FLTR.text.text('Score: ' + FLTR.score + '  Level: ' + FLTR.level, 5, 14, 14, 'white');
            FLTR.text.rightAlignedText('Time: ' + FLTR.timeLeft + 's', FLTR.CANVAS_WIDTH - 5, 14, 14, 'white');

            // paused overlay
            if (FLTR.gamePaused && !FLTR.levelTransition && !FLTR.gameEnded) {
                const centerX = FLTR.CANVAS_WIDTH / 2;
                const centerY = FLTR.CANVAS_HEIGHT / 2;
                FLTR.text.centeredText('Paused', centerX, centerY, 24, FLTR.TEXT_COLOR);
            }

            // level transition 
            if (FLTR.levelTransition) {
                const centerX = FLTR.CANVAS_WIDTH / 2;
                const centerY = FLTR.CANVAS_HEIGHT / 2;

                FLTR.text.centeredText('Level Complete!', centerX, centerY - 20, 24, FLTR.TEXT_COLOR);
                FLTR.text.centeredText('Press spacebar to continue...', centerX, centerY + 20, 18, FLTR.TEXT_COLOR);
            }

            if (FLTR.gameEnded) {
                const centerX = FLTR.CANVAS_WIDTH / 2;
                const centerY = FLTR.CANVAS_HEIGHT / 2;

                FLTR.text.centeredText('Game Over', centerX, centerY - 20, 24, FLTR.TEXT_COLOR);
                FLTR.text.centeredText('Your score was: ' + FLTR.score, centerX, centerY + 20, 16, FLTR.TEXT_COLOR);
            }
        } catch (error) {
            console.error('Draw error:', error.message);
        }
    },

    gameloop: function (timestamp) {
        try {
            if (!FLTR.gamePaused && !FLTR.gameEnded) {
                FLTR.draw();
                FLTR.update();
                game = requestAnimationFrame(FLTR.gameloop);
            } else if (FLTR.gameEnded) {
                FLTR.draw();
            }
        } catch (error) {
            console.error('Gameloop error:', error.message);
            cancelAnimationFrame(game);
        }
    }
};

FLTR.character = {
    clear: function () {
        if (FLTR.ctx) {
            FLTR.ctx.clearRect(0, 0, FLTR.CANVAS_WIDTH, FLTR.CANVAS_HEIGHT);
        }
    },

    circle: function (x, y, r) {
        if (FLTR.ctx) {
            FLTR.ctx.beginPath();
            FLTR.ctx.fillStyle = FLTR.BALL_COLOR;
            FLTR.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            FLTR.ctx.closePath();
            FLTR.ctx.fill();
        }
    }
};

FLTR.squares = {
    random: function () {
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 100) {
            FLTR.foodXPos = Math.round((FLTR.CANVAS_WIDTH - FLTR.FOOD_WIDTH) * Math.random());
            FLTR.foodYPos = Math.round(FLTR.HEADER_HEIGHT + (FLTR.CANVAS_HEIGHT - FLTR.HEADER_HEIGHT - FLTR.FOOD_HEIGHT) * Math.random());

            validPosition = true;

            for (let i = 0; i < FLTR.obstacles.length; i++) {
                const obs = FLTR.obstacles[i];
                if (FLTR.rectanglesOverlap(
                        FLTR.foodXPos, FLTR.foodYPos, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT,
                        obs.x, obs.y, obs.width, obs.height
                    )) {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }
    },

    food: function (x, y) {
        if (FLTR.ctx) {
            FLTR.ctx.fillStyle = FLTR.FOOD_COLOR;
            FLTR.ctx.fillRect(x, y, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT);
            FLTR.ctx.strokeStyle = FLTR.FOOD_STROKE_COLOR;
            FLTR.ctx.strokeRect(x, y, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT);
        }
    },

    obstacle: function (x, y, width, height) {
        if (FLTR.ctx) {
            FLTR.ctx.fillStyle = FLTR.OBSTACLE_COLOR;
            FLTR.ctx.fillRect(x, y, width, height);
            FLTR.ctx.strokeStyle = FLTR.OBSTACLE_STROKE_COLOR;
            FLTR.ctx.lineWidth = FLTR.OBSTACLE_STROKE_WIDTH;
            FLTR.ctx.strokeRect(x, y, width, height);
            FLTR.ctx.lineWidth = 1;
        }
    }
};

FLTR.text = {
    text: function (string, x, y, size, col) {
        if (FLTR.ctx) {
            FLTR.ctx.font = 'bold ' + size + 'px ' + FLTR.TEXT_FONT;
            FLTR.ctx.fillStyle = col;
            FLTR.ctx.fillText(string, x, y);
        }
    },

    rightAlignedText: function (string, x, y, size, col) {
        if (FLTR.ctx) {
            FLTR.ctx.font = 'bold ' + size + 'px ' + FLTR.TEXT_FONT;
            FLTR.ctx.fillStyle = col;
            FLTR.ctx.textAlign = 'right';
            FLTR.ctx.fillText(string, x, y);
            FLTR.ctx.textAlign = 'left';
        }
    },

    centeredText: function (string, x, y, size, col) {
        if (FLTR.ctx) {
            FLTR.ctx.font = 'bold ' + size + 'px ' + FLTR.TEXT_FONT;
            FLTR.ctx.fillStyle = col;
            FLTR.ctx.textAlign = 'center';
            FLTR.ctx.textBaseline = 'middle';
            FLTR.ctx.fillText(string, x, y);
            FLTR.ctx.textAlign = 'left';
            FLTR.ctx.textBaseline = 'alphabetic';
        }
    }
};

FLTR.checkKeys = {
    move: function () {
        if (FLTR.space) {
            FLTR.ySpeed = 0;
            FLTR.xSpeed = 0;
        }
        if (FLTR.left) {
            FLTR.xSpeed -= FLTR.SPEED_INCREMENT;
        }
        if (FLTR.right) {
            FLTR.xSpeed += FLTR.SPEED_INCREMENT;
        }
        if (FLTR.up) {
            FLTR.ySpeed -= FLTR.SPEED_INCREMENT;
        }
        if (FLTR.down) {
            FLTR.ySpeed += FLTR.SPEED_INCREMENT;
        }
    }
};

window.onkeydown = function (event) {
    const keyPressed = event.key;

    switch (keyPressed) {
        case FLTR.KEY_SPACE:
            if (FLTR.levelTransition) {
                FLTR.continueToNextLevel();
            }
            break;
        case FLTR.KEY_SHIFT:
            FLTR.space = true;
            break;
        case FLTR.KEY_LEFT:
            FLTR.left = true;
            break;
        case FLTR.KEY_UP:
            FLTR.up = true;
            break;
        case FLTR.KEY_RIGHT:
            FLTR.right = true;
            break;
        case FLTR.KEY_DOWN:
            FLTR.down = true;
            break;
    }
}

window.onkeyup = function (event) {
    const keyPressed = event.key;

    switch (keyPressed) {
        case FLTR.KEY_SHIFT:
            FLTR.space = false;
            break;
        case FLTR.KEY_LEFT:
            FLTR.left = false;
            break;
        case FLTR.KEY_UP:
            FLTR.up = false;
            break;
        case FLTR.KEY_RIGHT:
            FLTR.right = false;
            break;
        case FLTR.KEY_DOWN:
            FLTR.down = false;
            break;
    }
}

showHideButton = function (id, displayType = "none") {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = displayType;
        } else {
            console.warn('Element with id "' + id + '" not found');
        }
    } catch (error) {
        console.error('showHideButton error:', error.message);
    }
}

updateButtonText = function (id, text) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = text;
        } else {
            console.warn('Element with id "' + id + '" not found');
        }
    } catch (error) {
        console.error('updateButtonText error:', error.message);
    }
}

updateTimer = function () {
    try {
        FLTR.timeLeft = FLTR.timeLeft - 1;
        return FLTR.timeLeft;
    } catch (error) {
        console.error('updateTimer error:', error.message);
        return 0;
    }
}

pauseGame = function () {
    try {
        if (!FLTR.gamePaused) {
            cancelAnimationFrame(game);
            clearInterval(timer);
            FLTR.gamePaused = true;
            FLTR.draw();
            updateButtonText("pauseb", "Resume");
        } else if (FLTR.gamePaused) {
            game = requestAnimationFrame(FLTR.gameloop);
            timer = setInterval(updateTimer, FLTR.TIMER_INTERVAL);
            FLTR.gamePaused = false;
            updateButtonText("pauseb", "Pause");
        }
    } catch (error) {
        console.error('pauseGame error:', error.message);
    }
}

endGame = function () {
    try {
        cancelAnimationFrame(game);
        clearInterval(timer);
        FLTR.gameEnded = true;
        showHideButton("restart", "block");
    } catch (error) {
        console.error('endGame error:', error.message);
    }
}

resetGame = function () {
    try {
        FLTR.level = FLTR.INITIAL_LEVEL;
        FLTR.score = 0;
        FLTR.timeLeft = FLTR.INITIAL_TIME;
        FLTR.gameEnded = false;
        FLTR.levelTransition = false;
        FLTR.levelScoreCount = 0;
        FLTR.xSpeed = 0;
        FLTR.ySpeed = 0;
        FLTR.x = 300;
        FLTR.y = 300;
        startGame();
    } catch (error) {
        console.error('resetGame error:', error.message);
    }
}

startGame = function () {
    try {
        if (!FLTR.canvas) {
            FLTR.init();
        }

        showHideButton("start");
        showHideButton("restart");
        FLTR.generateObstacles();
        FLTR.squares.random();
        game = requestAnimationFrame(FLTR.gameloop);
        timer = setInterval(updateTimer, FLTR.TIMER_INTERVAL);
        updateTimer();
    } catch (error) {
        console.error('startGame error:', error.message);
    }
}