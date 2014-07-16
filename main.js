function submitClick() {
    if (elapsedtime >= 10800) {
        alert("Wow, how long have you been playing? Sorry, but your score could not be submitted. :(");
        return
    }
    var e = prompt("You are submitting your score of " + elapsedtime + " seconds! Please enter your initials (2 letter maximum):", "??");
    if (e.length > 2) {
        do {
            e = prompt("Please enter your initials only (2 letter maximum):", "??")
        } while (e.length > 2)
    }
    if (e != null) {
        Clay.ready(function () {
            var t = new Clay.Leaderboard({
                id: 4227
            });
            t.post({
                score: elapsedtime,
                name: e
            }, function (e) {})
        });
        button.visible = false
    }
}

function playClick() {
    this.game.state.start("play");
    this.game.time.reset();
    music.play()
}
var load_state = {
    preload: function () {
        this.game.load.image("sky", "assets/sky1.png");
        this.game.load.image("birdy", "assets/nerdy.png");
        this.game.load.image("cloud", "assets/cloud.png");
        this.game.load.image("submit", "assets/submitbutton.png");
        this.game.load.image("replay", "assets/playbutton.png");
        this.game.load.image("startbutton", "assets/play.png");
        this.game.load.audio("fireflies", ["assets/Fireflies.m4a", "assets/Fireflies.ogg"])
    },
    create: function () {
        this.game.stage.backgroundColor = "#87def9";
        this.game.state.start("menu")
    }
};
var menu_state = {
    create: function () {
        this.sky = this.game.add.sprite(0, 0, "sky");
        music = game.add.audio("fireflies");
        var e = game.world.width / 2,
            t = game.world.height / 2;
        var n = {
            font: '30px "Raleway"',
            fill: "#000000"
        };
        if (elapsedtime > 0) {
            var r = this.game.add.text(e - 75, t - 150, "Game Over!", n);
            var i = this.game.add.text(e, t - 50, "You survived for " + elapsedtime + " seconds", n);
            button = this.game.add.button(e - 140, t + 100, "submit", submitClick, this, 2, 1, 0);
            pbutton = this.game.add.button(e - 140, t, "replay", playClick, this, 2, 1, 0);
            i.anchor.setTo(.5, .5)
        } else {
            sbutton = this.game.add.button(e - 140, t + 25, "startbutton", this.start, this, 2, 1, 0);
            var s = this.game.add.text(e, t - 25, "Press Spacebar to Jump!", n);
            s.anchor.setTo(.5, .5)
        }
    },
    start: function () {
        playClick()
    }
};
var play_state = {
    create: function () {
        var e = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        e.onDown.add(this.jump, this);
        this.space = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.space.onDown.add(function () {
            game.paused = !game.paused
        }, this);
        this.sky = this.game.add.sprite(0, 0, "sky");
        this.clouds = game.add.group();
        this.clouds.createMultiple(20, "cloud");
        this.ceiling = this.game.add.sprite(0, 0);
        xVal = 150;
        yVal = 0;
        this.game.time.events.add(1e3, this.first_row_of_clouds, this);
        this.timer = this.game.time.events.loop(2500, this.add_row_of_clouds, this);
        this.birdy = this.game.add.sprite(100, 200, "birdy");
        this.birdy.body.gravity.y = 1e3;
        this.birdy.anchor.setTo(-.2, .5);
        elapsedtime = 0;
        this.game.physics.setBoundsToWorld(false, false, true, false)
    },
    update: function () {
        if (this.birdy.inWorld == false) this.game_over();
        if (this.birdy.angle < 20) this.birdy.angle += 1;
        this.game.physics.overlap(this.birdy, this.clouds, this.hit_cloud, null, this);
        this.birdy.body.collideWorldBounds = true
    },
    jump: function () {
        if (this.birdy.alive == false) return;
        this.birdy.body.velocity.y = -350;
        var e = this.game.add.tween(this.birdy);
        e.to({
            angle: -20
        }, 45);
        e.start()
    },
    game_over: function () {
        this.birdy.body.velocity.x = 0;
        this.birdy.body.velocity.y = 0;
        elapsedtime = this.game.time.totalElapsedSeconds();
        elapsedtime = Math.floor(elapsedtime * 1) / 1;
        this.game.time.reset();
        this.game.time.events.remove(this.timer);
        music.stop();
        this.game.state.start("menu")
    },
    add_one_cloud: function (e, t) {
        var n = this.clouds.getFirstDead();
        n.reset(e, t);
        n.body.velocity.x = -150;
        n.outOfBoundsKill = true
    },
    first_row_of_clouds: function () {
        for (var e = 0; e < 4; e++) {
            if (xVal < 750) {
                xVal += 150
            }
            yVal = Math.floor(Math.random() * 5) + 1;
            yVal = yVal * 100;
            this.add_one_cloud(xVal, yVal)
        }
    },
    add_row_of_clouds: function () {
        xVal = 300;
        for (var e = 0; e < 3; e++) {
            if (xVal < 750) {
                xVal += 150
            } else {
                xVal = 450
            }
            do {
                nyVal = Math.floor(Math.random() * 5) + 1;
                nyVal = nyVal * 100
            } while (nyVal == yVal);
            yVal = nyVal;
            this.add_one_cloud(xVal, yVal)
        }
    },
    hit_cloud: function () {
        if (this.birdy.alive == false) return;
        this.birdy.alive = false;
        this.game.time.events.remove(this.timer);
        this.clouds.forEachAlive(function (e) {
            e.body.velocity.x = 0
        }, this)
    }
};
var game = new Phaser.Game(800, 600, Phaser.AUTO, "game_div");
var score = 0;
var button;
var pbutton;
var elapsedtime = 0;
game.state.add("load", load_state);
game.state.add("menu", menu_state);
game.state.add("play", play_state);
game.state.start("load")