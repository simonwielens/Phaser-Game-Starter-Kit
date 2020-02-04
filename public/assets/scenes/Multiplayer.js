var player1;
var score1 = 0;
var cursors1;
var scoreText1;

var player2;
var score2 = 0;
var cursors2;
var scoreText2;

var gameOver = false;

var speed = 20;

var player;
var stars;
var bombs;
var platforms;
var score = 0;
var gameOver = false;
var scoreText;

export default class Multiplayer extends Phaser.Scene {
	constructor() {
		super({
			key: 'Multiplayer'
		});
	}
	preload() {
		this.load.audio('queen', ['assets/sounds/queen.mp3']);
		this.load.audio('rude', ['assets/sounds/rude.mp3']);
		this.load.audio('standup', ['assets/sounds/standup.mp3']);
		this.load.audio('twat', ['assets/sounds/twat.mp3']);
		this.load.audio('whore', ['assets/sounds/whore.mp3']);
		this.load.audio('music', ['assets/sounds/Norway.mp3']);
		this.load.image('sky', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('star', 'assets/wine.png');
		this.load.image('bomb', 'assets/barrel.png');
		this.load.spritesheet('dude1', 'assets/ida1.png', {
			frameWidth: 32,
			frameHeight: 48
		});
		this.load.spritesheet('dude2', 'assets/Ida-black.png', {
			frameWidth: 32,
			frameHeight: 48
		});
	}
	create() {
		//  A simple background for our game
		this.add.image(400, 300, 'sky');
		this.sound.play('music', {
			mute: false,
			volume: 0.3,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: true,
			delay: 0
		});

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = this.physics.add.staticGroup();

		//  Here we create the ground.
		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		platforms
			.create(400, 568, 'ground')
			.setScale(2)
			.refreshBody();

		//  Now let's create some ledges
		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');

		// The player and its settings
		player1 = this.physics.add.sprite(100, 450, 'dude1');
		player2 = this.physics.add.sprite(100, 450, 'dude2');

		//  Player physics properties. Give the little guy a slight bounce.
		player1.setBounce(0.2);
		player1.setCollideWorldBounds(true);

		player2.setBounce(0.2);
		player2.setCollideWorldBounds(true);

		//  Our player animations, turning, walking left and walking right.
		this.anims.create({
			key: 'left1',
			frames: this.anims.generateFrameNumbers('dude1', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn1',
			frames: [{ key: 'dude1', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right1',
			frames: this.anims.generateFrameNumbers('dude1', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'left2',
			frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn2',
			frames: [{ key: 'dude2', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right2',
			frames: this.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		//  Input Events
		cursors1 = this.input.keyboard.createCursorKeys();

		cursors2 = this.input.keyboard.addKeys('W,S,A,D');

		//  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		stars.children.iterate(function(child) {
			//  Give each star a slightly different bounce
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		bombs = this.physics.add.group();

		//  The score
		scoreText1 = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			fill: '#000'
		});
		scoreText2 = this.add.text(416, 16, 'score: 0', {
			fontSize: '32px',
			fill: '#000'
		});

		//  Collide the player and the stars with the platforms
		this.physics.add.collider(player1, platforms);
		this.physics.add.collider(player2, platforms);
		this.physics.add.collider(stars, platforms);
		this.physics.add.collider(bombs, platforms);

		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		this.physics.add.overlap(player1, stars, collectStar, null, this);
		this.physics.add.overlap(player2, stars, collectStar, null, this);

		this.physics.add.collider(player1, bombs, hitBomb, null, this);
		this.physics.add.collider(player2, bombs, hitBomb, null, this);
	}
	update(time, delta) {
		if (gameOver) {
			return;
		}

		if (cursors1.left.isDown) {
			player1.setVelocityX(-160);

			player1.anims.play('left1', true);
		} else if (cursors2.A.isDown) {
			player2.setVelocityX(-160);

			player2.anims.play('left2', true);
		} else if (cursors1.right.isDown) {
			player1.setVelocityX(160);

			player1.anims.play('right1', true);
		} else if (cursors2.D.isDown) {
			player2.setVelocityX(160);

			player2.anims.play('right2', true);
		} else if (cursors1.down.isDown) {
			player1.setVelocityX(0);

			player1.anims.play('turn1');
		} else if (cursors2.S.isDown) {
			player2.setVelocityX(0);

			player2.anims.play('turn2');
		}

		if (cursors1.up.isDown && player1.body.touching.down) {
			player1.setVelocityY(-330);
		} else if (cursors2.W.isDown && player2.body.touching.down) {
			player2.setVelocityY(-330);
		}
	}
}

export function collectStar(player, star) {
	star.disableBody(true, true);
	if (Phaser.Math.FloatBetween(0.1, 0.9) > 0.5) {
		var rand = Phaser.Math.FloatBetween(0.1, 0.9);
		if (rand < 0.3) {
			this.sound.play('standup');
		} else if (rand < 0.6) {
			this.sound.play('queen');
		} else {
			this.sound.play('whore');
		}
	}

	if (player === player1) {
		score1 += 10;
		scoreText1.setText('Score: ' + score1);
	} else {
		score2 += 10;
		scoreText2.setText('Score: ' + score2);
	}

	//  Add and update the score

	if (stars.countActive(true) === 0) {
		//  A new batch of stars to collect
		stars.children.iterate(function(child) {
			child.enableBody(true, child.x, 0, true, true);
		});

		var x =
			player1.x < 400
				? Phaser.Math.Between(400, 800)
				: Phaser.Math.Between(0, 400);

		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		bomb.allowGravity = false;

		this.speed = this.speed * 2;
	}
}

export function hitBomb(player, bomb) {
	this.physics.pause();
	this.sound.play('twat');

	if (player === player1) {
		player1.setTint(0xff0000);
		player1.anims.play('turn');
	} else {
		player2.setTint(0xff0000);
		player2.anims.play('turn');
	}

	gameOver = true;

	this.make.text({
		x: 200,
		y: 300,
		text: 'Ida Wins',
		style: {
			fontSize: '30px',
			fontFamily: 'Fredericka the Great',
			color: '#ffffff',
			align: 'center',
			shadow: {
				color: '#000000',
				fill: true,
				offsetX: 2,
				offsetY: 2,
				blur: 8
			}
		}
	});
}
