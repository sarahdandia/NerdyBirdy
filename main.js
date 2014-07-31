var load_state = {
    preload: function () {
        game.load.image("sky", "assets/sky1.png");
        game.load.image("birdy", "assets/nerdy.png");
        game.load.image("cloud", "assets/cloud.png");
        game.load.image("submitButton", "assets/submitbutton.png");
        game.load.image("replayButton", "assets/playbutton.png");
        game.load.image("startbutton", "assets/play.png");
        game.load.audio("fireflies", ["assets/Fireflies.m4a", "assets/Fireflies.ogg"])
    },
    create: function () {
        game.stage.backgroundColor = "#87def9";
        game.state.start("menu")
    }
};

var menu_state = {
    create: function () {
        game.add.sprite(0, 0, "sky");
        music = game.add.audio("fireflies");
        var centerX = game.world.width / 2; // find center of the screen
        var centerY = game.world.height / 2;
        var style = { // set styling for game text
            font: '30px "Raleway"',
            fill: "#000000"
        };
        if (elapsedtime > 0) {   // if user has already played one round
            game.add.text(centerX - 75, centerY - 150, "Game Over!", style);
            game.add.text(centerX - 185, centerY - 75, "You survived for " + elapsedtime + " seconds", style);
            submit = game.add.button(centerX - 140, centerY + 100, "submitButton", this.submitClick, this, 2, 1, 0);
            game.add.button(centerX - 140, centerY, "replayButton", this.start, this, 2, 1, 0);
        } else {  // this is the first round for user
            game.add.button(centerX - 140, centerY + 25, "startbutton", this.start, this, 2, 1, 0);
            game.add.text(centerX - 165, centerY - 75, "Press Spacebar to Jump!", style);
        }
    },
    start: function () {
        game.time.reset(); // restart time of game
        music.play("",0,1,true,true); // play the music
        game.state.start("play");
    },
    submitClick: function() {
       if (elapsedtime >= 10800) {
            alert("Wow, how long have you been playing? Sorry, but your score could not be submitted.");
            return;
        } 
        var userInitials = prompt("You are submitting your score of " + elapsedtime + " seconds! Please enter your initials (2 letter maximum):", "??");
        if (userInitials.length > 2) {
            do {
                userInitials = prompt("Please enter your initials only (2 letter maximum):", "??")
            } while (userInitials.length > 2)
        }
        if (userInitials != null) {
            Clay.ready(function () { // access Clay leaderboard
                var scoreBoard = new Clay.Leaderboard({ id: 4227 });
                scoreBoard.post({ 
                    score: elapsedtime,
                    name: userInitials
                }, function (userInitials) {})
            }); // post to the leaderboard
            submit.visible = false; // hide the submit button now
        }
    }
};
var play_state = {
    create: function () {
        var e = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        e.onDown.add(this.jump, this); // call jump function when spacebar is pressed
        game.add.sprite(0, 0, "sky");
        game.physics.setBoundsToWorld(false, false, true, false); // set boundary for ceiling of game
        birdy = game.add.sprite(100, 200, "birdy");
        birdy.body.gravity.y = 1000; 
        birdy.anchor.setTo(-.2, .5); // set the center of rotation so the flappy motion is smooth
        clouds = game.add.group();
        clouds.createMultiple(20, "cloud");
        game.time.events.add(1000, this.loop_through_clouds, this); // add first group of clouds
        timer = game.time.events.loop(2500, this.loop_through_clouds, this); // clouds forever!
        elapsedtime = 0; // game starts now
    },
    update: function () { // constantly running function
        if (birdy.inWorld == false) this.game_over(); // if out of bounds, game over
        if (birdy.angle < 20) birdy.angle += 1; // tilt birdy down bit by bit (gravity brings it down)
        game.physics.overlap(birdy, clouds, this.hit_cloud, null, this); // cloud collision!
        birdy.body.collideWorldBounds = true; // let birdy bounce off the ceiling boundary
    },
    jump: function () { // called when spacebar is pressed
        if (birdy.alive == false) return; // exit if out of bounds
        birdy.body.velocity.y = -350; // change y velocity so it moves up quickly
        var flappy = game.add.tween(birdy); // add flappy motion when birdy jumps
        flappy.to({ angle: -20 }, 45); // tilt birdy up!
        flappy.start(); 
    },
    game_over: function () {
        birdy.body.velocity.x = 0;  //stop birdy from moving
        birdy.body.velocity.y = 0;
        elapsedtime = game.time.totalElapsedSeconds(); // get total game time
        elapsedtime = Math.floor(elapsedtime * 1) / 1; // round to nearest second
        game.time.reset(); 
        game.time.events.remove(timer); // clear out timer
        music.stop(); 
        game.input.keyboard.clearCaptures(); //stop capturing SpaceBar input
        game.state.start("menu"); // go back to menu screen
    },
    add_a_cloud: function (xPos, yPos) {
        var addCloud = clouds.getFirstDead(); // grab a dead cloud
        addCloud.reset(xPos, yPos); // make it alive again on the game screen
        addCloud.body.velocity.x = -150;  // make it move
        addCloud.outOfBoundsKill = true; // if it goes out of bounds, kill it
    },
    loop_through_clouds: function() {
        xVal = 300; // start new clouds at a position of 300px
        for (i = 0; i < 3; i++) {
            if (xVal < 750) {
                xVal += 150; // create each new cloud 150px away from the first
            } else {
                xVal = 450; // if off the screen (past 750), restart at 450px
            }
            do { // generate a new height for cloud that isnt same as the previous one
                newyVal = Math.floor(Math.random() * 6);
                newyVal = newyVal * 100;
            } while (newyVal == yVal);
            yVal = newyVal;
            this.add_a_cloud(xVal, yVal);
        }
    },
    hit_cloud: function () { // collision between birdy and cloud
        if (birdy.alive == false) return; 
        birdy.alive = false;
        game.time.events.remove(timer);
        clouds.forEachAlive(function (e) {e.body.velocity.x = 0}, this) // halt all the clouds
    }
};


var game = new Phaser.Game(800, 600, Phaser.AUTO, "game_div");
var score = 0;
var xVal, newyVal;
var yVal = 0;
var submit;
var i;
var elapsedtime = 0;
game.state.add("load", load_state);
game.state.add("menu", menu_state);
game.state.add("play", play_state);
game.state.start("load");