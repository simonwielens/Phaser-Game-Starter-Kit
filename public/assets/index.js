// import { Game } from './phaser.min.js';
import Intro from './scenes/Intro.js';
import Level1 from './scenes/Level1.js';
import Multiplayer from './scenes/Multiplayer.js';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scale: {
		scale: 'SHOW_ALL',
		orientation: 'LANDSCAPE'
	},
	resolution: window.devicePixelRatio,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [Intro, Level1, Multiplayer]
};

var game = new Phaser.Game(config);
