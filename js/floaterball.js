/*
Title:      Floater Ball
Author:     Drew D. Lenhart
Website:    https://github.com/dlenhart/floaterball
Date:       11-24-2024
Version:    0.0.9

Description:  Collect as many squares as possible within the time 
limit. Use the walls and other objects to your advantage.
*/

let FLTR = 
{
    x_speed: 0,
    y_speed: 0,
    gravity: 0.98,
    y: 300,
    x: 300,
    r: 10,
    cw: 20,
    cl: 20,
    food_x_pos: 0,
    food_y_pos: 0,
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    pause: false,
    gamePaused: false,
    score: 0,
    canvas_width: 600,
    canvas_height: 400,
    canvas: null,
    ctx: null,
    time_left: 10,
    level: 1,
    total_levels: 5,
    debug: true,
    game_ended: false,
    timer_interval: 1000,
    frame_rate: 30,

    init: function () {
        FLTR.canvas = document.getElementsByTagName('canvas')[0];
        FLTR.canvas.width = FLTR.canvas_width;
        FLTR.canvas.height = FLTR.canvas_height;
        FLTR.ctx = FLTR.canvas.getContext('2d');

        FLTR.gameloop();
    },

    update: function () {
        FLTR.checkKeys.move();
        FLTR.x_speed *= FLTR.gravity;
        FLTR.y_speed *= FLTR.gravity;

        FLTR.windowXcollision();
        FLTR.windowYcollision();
        FLTR.foodCollision();

        FLTR.x += FLTR.x_speed;
        FLTR.y += FLTR.y_speed;

        FLTR.levelCheck();
    },

    windowXcollision: function () {
        if (FLTR.x + FLTR.x_speed <= 0 || FLTR.x + FLTR.x_speed >= FLTR.canvas.width) {
            FLTR.x_speed = -FLTR.x_speed;
            if (FLTR.debug) console.log(FLTR.canvas.width + " Position: " + FLTR.x);
        }
    },

    windowYcollision: function () {
        if (FLTR.y + FLTR.y_speed < 0 || FLTR.y + FLTR.y_speed >= FLTR.canvas.height) {
            FLTR.y_speed = -FLTR.y_speed;
            if (FLTR.debug) console.log(FLTR.canvas.height + " Position: " + FLTR.y);
        }
    },

    foodCollision: function () {
        if (Math.round(FLTR.x) < FLTR.food_x_pos + FLTR.cl &&
            Math.round(FLTR.x) + FLTR.r > FLTR.food_x_pos &&
            Math.round(FLTR.y) < FLTR.food_y_pos + FLTR.cw &&
            FLTR.r + Math.round(FLTR.y) > FLTR.food_y_pos
        ){
            if (FLTR.debug) console.log("Food collision");
            FLTR.score++;
            FLTR.squares.random();
        }
    },

    levelCheck: function () {
        if (FLTR.time_left == 0 && FLTR.level !== FLTR.total_levels) {
            FLTR.time_left = 10;
            FLTR.level = FLTR.level + 1;
        } else if (FLTR.level == FLTR.total_levels) {
            endGame();
        }

        return;
    },

    draw: function () {
        FLTR.character.clear();
        FLTR.character.circle(FLTR.x, FLTR.y, FLTR.r);
        FLTR.squares.food(FLTR.food_x_pos, FLTR.food_y_pos);
        FLTR.text.text('Score: ' + FLTR.score, 20, 30, 14, 'green');
        FLTR.text.text('Time: ' + FLTR.time_left + ' seconds', 20, 50, 14, 'green');
        FLTR.text.text('Level: ' + FLTR.level, 20, 70, 14, 'green');
    },

    gameloop: function () {
        FLTR.draw();
        FLTR.update();
    }
};

FLTR.character = {
    clear: function () {
        FLTR.ctx.clearRect(0, 0, FLTR.canvas_width, FLTR.canvas_height);
    },

    circle: function (x, y, r) {
        FLTR.ctx.beginPath();
        FLTR.ctx.fillStyle = "#ffffff";
        FLTR.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        FLTR.ctx.closePath();
        FLTR.ctx.fill();
    }
};

FLTR.squares = {
    random: function () {
        FLTR.food_x_pos = Math.round((FLTR.canvas_width - FLTR.cw) * Math.random());
        FLTR.food_y_pos = Math.round((FLTR.canvas_height - FLTR.cw) * Math.random());
    },

    food: function (x, y) {
        FLTR.ctx.fillStyle = "#6F7678";
        FLTR.ctx.fillRect(x, y, FLTR.cl, FLTR.cw);
        FLTR.ctx.strokeStyle = "white";
        FLTR.ctx.strokeRect(x, y, FLTR.cl, FLTR.cw);
    }
};

FLTR.text = {
    text: function (string, x, y, size, col) {
        FLTR.ctx.font = 'bold ' + size + 'px Courier New';
        FLTR.ctx.fillStyle = col;
        FLTR.ctx.fillText(string, x, y);
    }
};

FLTR.checkKeys = {
    move: function () {
        if (FLTR.space) {
            FLTR.y_speed = 0;
            FLTR.x_speed = 0;
        }
        if (FLTR.left) {
            FLTR.x_speed--;
        }
        if (FLTR.right) {
            FLTR.x_speed++;
        }
        if (FLTR.up) {
            FLTR.y_speed--;
        }
        if (FLTR.down) {
            FLTR.y_speed++;
        }
    }
};

window.onkeydown = function (event) {
    let key_pressed;

    if (event == null) {
        key_pressed = window.event.keyCode;
    } else {
        key_pressed = event.keyCode;
    }

    switch (key_pressed) {
        case 16:
            FLTR.space = true;
            break;
        case 37:
            FLTR.left = true;
            break;
        case 38:
            FLTR.up = true;
            break;
        case 39:
            FLTR.right = true;
            break;
        case 40:
            FLTR.down = true;
            break;
    }
}

window.onkeyup = function (event) {
    let key_pressed;

    if (event == null) {
        key_pressed = window.event.keyCode;
    } else {
        key_pressed = event.keyCode;
    }

    switch (key_pressed) {
        case 16:
            FLTR.space = false;
            break;
        case 37:
            FLTR.left = false;
            break;
        case 38:
            FLTR.up = false;
            break;
        case 39:
            FLTR.right = false;
            break;
        case 40:
            FLTR.down = false;
            break;
    }
}

showHideButton = function (id, displayType = "none") {
    document.getElementById(id).style.display = displayType;
}

updateButtonText = function (id, text) {
    document.getElementById(id).innerHTML = text;
}

updateTimer = function () {
    FLTR.time_left = FLTR.time_left - 1;
    return FLTR.time_left;
}

pauseGame = function () {
    if (!FLTR.gamePaused) {
        game = clearTimeout(game);
        timer = clearTimeout(timer);
        FLTR.gamePaused = true;

        updateButtonText("pauseb", "Resume");
    } else if (FLTR.gamePaused) {
        game = setInterval(FLTR.init, FLTR.frame_rate);
        timer = setInterval(updateTimer, FLTR.timer_interval);
        FLTR.gamePaused = false;

        updateButtonText("pauseb", "Pause");
    }
}

endGame = function () {
    game = clearTimeout(game);
    timer = clearInterval(timer);
    showHideButton("restart", "block");
}

resetGame = function () {
    FLTR.level = 1;
    FLTR.score = 0;
    startGame();
}

startGame = function () {
    showHideButton("start");
    FLTR.squares.random();
    game = setInterval(FLTR.init, FLTR.frame_rate);
    timer = setInterval(updateTimer, FLTR.timer_interval);
    updateTimer();
}