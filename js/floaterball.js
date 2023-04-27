/*
Title:      Floater Ball
Author:     Drew D. Lenhart
Website:    https://github.com/dlenhart/floaterball
Date:       04-26-2023
Version:    0.0.8

Description:  Collect as many squares as possible within the time limit.  Use the walls and other objects to your advantage.
*/

var FLTR = {
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
    time_left: 60,
    level: 1,
    total_levels: 60 / 5,
    debug: true,
    game_ended: false,

    init: function () {
        FLTR.canvas = document.getElementsByTagName('canvas')[0];
        FLTR.canvas.width = FLTR.canvas_width;
        FLTR.canvas.height = FLTR.canvas_height;
        FLTR.ctx = FLTR.canvas.getContext('2d');

        FLTR.gameloop();
    },

    update: function () {
        // Key check
        FLTR.checkKeys.move();

        // Gravity
        FLTR.x_speed *= FLTR.gravity;
        FLTR.y_speed *= FLTR.gravity;

        // X Collision
        if (FLTR.x + FLTR.x_speed <= 0 || FLTR.x + FLTR.x_speed >= FLTR.canvas.width) {
            FLTR.x_speed = -FLTR.x_speed;
            if (FLTR.debug) console.log(FLTR.canvas.width + " Position: " + FLTR.x);
        }

        // Y Collision
        if (FLTR.y + FLTR.y_speed < 0 || FLTR.y + FLTR.y_speed >= FLTR.canvas.height) {
            FLTR.y_speed = -FLTR.y_speed;
            if (FLTR.debug) console.log(FLTR.canvas.height + " Position: " + FLTR.y);
        }

        // Collision
        if (Math.round(FLTR.x) < FLTR.food_x_pos + FLTR.cl &&
            Math.round(FLTR.x) + FLTR.r > FLTR.food_x_pos &&
            Math.round(FLTR.y) < FLTR.food_y_pos + FLTR.cw &&
            FLTR.r + Math.round(FLTR.y) > FLTR.food_y_pos
        ) {

            if (FLTR.debug) console.log("Food collision");
            FLTR.score++;
            FLTR.squares.random();
        }

        FLTR.x += FLTR.x_speed;
        FLTR.y += FLTR.y_speed;

        //testing limits
        if (FLTR.time_left == 0) {
            FLTR.time_left = 60;
            FLTR.level = FLTR.level + 1;
            console.log("Level: " + FLTR.level + " out of: " + FLTR.total_levels);
        } else {
            //endGame();
        }

    },

    draw: function () {
        FLTR.character.clear();

        // Player
        FLTR.character.circle(FLTR.x, FLTR.y, FLTR.r);

        // Food
        FLTR.squares.food(FLTR.food_x_pos, FLTR.food_y_pos);

        // Score
        FLTR.text.text('Score: ' + FLTR.score, 20, 30, 14, 'green');

        // Timer
        FLTR.text.text('Time: ' + FLTR.time_left, 20, 50, 14, 'green');

        // Level
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
    var key_pressed;
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
    var key_pressed;
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

function updateTimer() {
    FLTR.time_left = FLTR.time_left - 1;
    return FLTR.time_left;
  }

function pauseGame() {
    if (!FLTR.gamePaused) {
        game = clearTimeout(game);
        FLTR.gamePaused = true;
        if (FLTR.debug) console.log("Game paused");
        document.getElementById('pauseb').innerHTML = 'Resume';
    } else if (FLTR.gamePaused) {
        game = setInterval(FLTR.init, 30);
        FLTR.gamePaused = false;
        document.getElementById('pauseb').innerHTML = 'Pause';
    }
}

function endGame() {
    game = clearTimeout(game);
    timer = clearInterval(timer);
    document.getElementById('restart').style.display = "block";
    // make an overlay?
}

function startGame() {
    //hide start
    document.getElementById('start').style.display = "none";
    FLTR.squares.random();
    game = setInterval(FLTR.init, 30);
    timer = setInterval(updateTimer, 1000);
    updateTimer();
}
