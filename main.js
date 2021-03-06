// Menu State before starting the game
var menuState = {
    preload : function() {
        game.load.image('background', 'assets/background.png');
    },

    create: function () {
        // Change the background color of the game to match fullstackfest
        game.add.tileSprite(0, 0, 800, 600, 'background');
        this.labelBrand = game.add.text(230, 150, " ------------\n| PUSHY BIRD |\n ------------", { font: "60px VT323", fill: "#ffffff" });
        this.labelStart = game.add.text(260, 400, "Press button to start", { font: "30px VT323", fill: "#ffffff" });
        this.labelFooter = game.add.text(320, 550, "@rgalindo33 2016", { font: "20px VT323", fill: "#ffffff" });


        this.labelBrand.setShadow(5, 5);
        this.labelStart.setShadow(5, 5);
        this.labelFooter.setShadow(5, 5);
        // Call the 'startGame' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.add(this.jump, this);
        timer = 0;
    },
    update: function (){
        timer += game.time.elapsed; //this is in ms, not seconds.
        if ( timer >= 1000 ) {
            timer -= 600;
            this.labelStart.visible = !this.labelStart.visible;
        }
    },

    jump: function () {
        // Change the state to the actual game.
        this.state.start('main');
    }
};

// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/monitor.png');
        game.load.image('background', 'assets/background.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('die', 'assets/dead.wav');
    },

    create: function() {
        // Change the background color of the game to match fullstackfest
        game.add.tileSprite(0, 0, 800, 600, 'background');

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position
        this.bird = game.add.sprite(100, 245, 'bird');

        // Create an empty group of pipes
        this.pipes = game.add.group();

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;
         // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Add pipes to our game
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Add score to our game
        this.score = 0;
        this.labelScoreText = game.add.text(20, 20, "SCORE:", { font: "30px VT323", fill: "#ffffff" });
        this.labelScore = game.add.text(110, 20, "0", { font: "30px VT323", fill: "#ffffff" });
        this.labelBrand = game.add.text(580, 450, " ----------\n|PUSHY BIRD|\n ----------", { font: "40px VT323", fill: "#ffffff" });

        this.labelScoreText.setShadow(5, 5);
        this.labelScore.setShadow(5, 5);
        this.labelBrand.setShadow(5, 5);

        // add sounds when jumping
        this.jumpSound = game.add.audio('jump');
        // and when dying
        this.dieSound = game.add.audio('die');

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.add(this.jump, this);
    },

    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 600)
            this.restartGame();

        // add angle to the direction the bird flyes
        if (this.bird.angle < 50)
            this.bird.angle += 1;

        // kill flappy if he hits a pipe line
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    // Make the bird jump
    jump: function() {
        // if flappy is dead, dont jump at all
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -400;

        //play sound
        this.jumpSound.play();

        // animate jumping bird
        game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        //play sound
        this.dieSound.play();

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // increase score
        this.score += 1;
        this.labelScore.text = this.score;

        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 7) + 1;

        // Add the N pipes
        // With one big hole at position 'hole' and 'hole + 1' and 'hole + 2'
        for (var i = 0; i < 15; i++)
            if (i != hole && i != hole + 1 && i != hole + 2)
                this.addOnePipe(800, i * 60 + 0);
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('menu');
    },

};

// Initialize Phaser
var game = new Phaser.Game(800, 600);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

game.state.add('menu', menuState);


// PUSHER STUFF
var pusher = new Pusher('57cad681aa44cad36271', {
  cluster: 'eu'
});

var button = pusher.subscribe('button');

button
  .bind('press', function(data) {
    game.state.states[game.state.current].jump()
  });

// Start the state to actually start the Game
game.state.start('menu');
