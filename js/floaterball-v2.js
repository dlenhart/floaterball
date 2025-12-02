/*
Title:      Floater Ball
Author:     Drew D. Lenhart
Website:    https://github.com/dlenhart/floaterball
Date:       12-02-2025
Version:    0.2.0

Description:  Collect as many squares as possible within the time 
limit. Use the walls and other objects to your advantage.
*/


let game = null;
let timer = null;

let FLTR = 
{
    DAMPING: 0.97,
    SPEED_INCREMENT: 0.5,
    INITIAL_TIME: 100,
    TIMER_INTERVAL: 1000,    
    INITIAL_LEVEL: 1,
    TOTAL_LEVELS: 100,    
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,    
    BALL_RADIUS: 10,
    BALL_COLOR: "#ffffff",    
    FOOD_WIDTH: 20,
    FOOD_HEIGHT: 20,
    FOOD_COLOR: "#6F7678",
    FOOD_STROKE_COLOR: "white",    
    TEXT_SIZE: 14,
    TEXT_COLOR: "green",
    TEXT_FONT: "Courier New",    
    KEY_SHIFT: "Shift",
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
    timeLeft: 100,
    level: 1,
    debug: false,
    gameEnded: false,
    lastFrameTime: 0,

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

            // Don't call gameloop here - it's called by startGame
        } catch (error) {
            console.error('Initialization error:', error.message);
            alert('Failed to initialize game: ' + error.message);
        }
    },

    // Calculate time for current level
    getLevelTime: function(level) {
        return Math.max(1, FLTR.INITIAL_TIME - (level - 1));
    },

    update: function () {
        try {
            FLTR.checkKeys.move();
            FLTR.xSpeed *= FLTR.DAMPING;
            FLTR.ySpeed *= FLTR.DAMPING;

            FLTR.windowXCollision();
            FLTR.windowYCollision();
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
        
        if (FLTR.y + FLTR.ySpeed - FLTR.BALL_RADIUS < 0 || 
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
        ){
            if (FLTR.debug) console.log("Food collision");
            FLTR.score++;
            FLTR.squares.random();
        }
    },

    levelCheck: function () {
        if (FLTR.timeLeft == 0 && FLTR.level !== FLTR.TOTAL_LEVELS) {
            FLTR.level = FLTR.level + 1;
            FLTR.timeLeft = FLTR.getLevelTime(FLTR.level);
        } else if (FLTR.level == FLTR.TOTAL_LEVELS && FLTR.timeLeft == 0) {
            endGame();
        }

        return;
    },

    draw: function () {
        try {
            FLTR.character.clear();
            FLTR.character.circle(FLTR.x, FLTR.y, FLTR.BALL_RADIUS);
            FLTR.squares.food(FLTR.foodXPos, FLTR.foodYPos);
            FLTR.text.text('Score: ' + FLTR.score, 20, 30, FLTR.TEXT_SIZE, FLTR.TEXT_COLOR);
            FLTR.text.text('Time: ' + FLTR.timeLeft + ' seconds', 20, 50, FLTR.TEXT_SIZE, FLTR.TEXT_COLOR);
            FLTR.text.text('Level: ' + FLTR.level, 20, 70, FLTR.TEXT_SIZE, FLTR.TEXT_COLOR);
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
        FLTR.foodXPos = Math.round((FLTR.CANVAS_WIDTH - FLTR.FOOD_WIDTH) * Math.random());
        FLTR.foodYPos = Math.round((FLTR.CANVAS_HEIGHT - FLTR.FOOD_HEIGHT) * Math.random());
    },

    food: function (x, y) {
        if (FLTR.ctx) {
            FLTR.ctx.fillStyle = FLTR.FOOD_COLOR;
            FLTR.ctx.fillRect(x, y, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT);
            FLTR.ctx.strokeStyle = FLTR.FOOD_STROKE_COLOR;
            FLTR.ctx.strokeRect(x, y, FLTR.FOOD_WIDTH, FLTR.FOOD_HEIGHT);
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
        FLTR.squares.random();
        game = requestAnimationFrame(FLTR.gameloop);
        timer = setInterval(updateTimer, FLTR.TIMER_INTERVAL);
        updateTimer();
    } catch (error) {
        console.error('startGame error:', error.message);
    }
}