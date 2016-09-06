// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');

    },

    create: function() {
        // Change the background color of the game to match fullstackfest
        game.stage.backgroundColor = '#10161e';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Create an empty group of pipes
        this.pipes = game.add.group();

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 900;
         // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Add pipes to our game
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Add score to our game
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px sans-serif", fill: "#ffffff" });

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },

    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490)
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
        this.bird.body.velocity.y = -300;

        // animate jumping bird
        game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

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
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');

var pusher = new Pusher('57cad681aa44cad36271', {
  cluster: 'eu'
});

var button = pusher.subscribe('button');

button
  .bind('press', function(data) {
    // console.log("MOE");
    //  var spaceKey = game.input.keyboard.addKey(
    //                     Phaser.Keyboard.SPACEBAR);
    // spaceKey.onDown.add(this.jump, this);
  });

// button release:
button
  .bind('release', function(data) {
  });


// pusher connection:
pusher.connection
  .bind('connected', function(){
  });
