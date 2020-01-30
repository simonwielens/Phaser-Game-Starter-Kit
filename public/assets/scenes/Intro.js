export default class Intro extends Phaser.Scene {
	constructor() {
		super({
			key: 'Intro'
		});
	}
	preload() {
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
		);

		this.load.image('sky', 'assets/sky.png');

		var progress = this.add.graphics();
		const self = this;
		this.load.on('progress', function(value) {
			progress.clear();
			progress.fillStyle(0x42f456, 1);
			progress.fillRect(0, 300, 800 * value, 20);
		});

		this.load.on('complete', function() {
			progress.destroy();
		});
	}
	create() {

		this.add.image(400, 300, 'sky');
		this.make.text({
			x: 100,
			y: 300,
			text: 'Press Space Bar to Play Ida Vs Ida (WASD + Arrows)',
			style: {
				fontSize: '30px',
				fontFamily: 'Monofett',
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
		var add = this.add;
		var input = this.input;
		WebFont.load({
			google: {
				families: ['Fredericka the Great', 'Monofett']
			},
			active: function() {
				add
					.text(75, 100, `The Pursuit of happiness`, {
						fontFamily: 'Fredericka the Great',
						fontSize: 50,
						color: '#ffffff'
					})
					.setShadow(2, 2, '#333333', 2, false, true);
			}
		});
		this.keys = this.input.keyboard.addKeys('SPACE');
	}
	update(delta) {
		if (this.keys.SPACE.isDown) {
			this.scene.start('Multiplayer');
		}
	}
}
