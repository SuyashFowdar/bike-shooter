import Phaser from 'phaser';
import ScrollingBackground from '../entities/ScrollingBackground';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  preload() {
    this.load.image('sprBg0', 'content/sprBg0.png');
    this.load.image('sprBg1', 'content/sprBg1.png');
    this.load.image('sprBtnPlay', 'content/sprBtnPlay.png');
    this.load.image('sprBtnPlayHover', 'content/sprBtnPlayHover.png');
    this.load.image('sprBtnPlayDown', 'content/sprBtnPlayDown.png');
    this.load.image('sprBtnRestart', 'content/sprBtnRestart.png');
    this.load.image('sprBtnRestartHover', 'content/sprBtnRestartHover.png');
    this.load.image('sprBtnRestartDown', 'content/sprBtnRestartDown.png');
    this.load.image('bg', 'content/bg.jpg');

    this.load.audio('sndBtnOver', 'content/sndBtnOver.wav');
    this.load.audio('sndBtnDown', 'content/sndBtnDown.wav');
  }

  create() {
    this.add.image(400, 300, 'bg');

    this.sfx = {
      btnOver: this.sound.add('sndBtnOver'),
      btnDown: this.sound.add('sndBtnDown'),
    };

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprBtnPlay',
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on('pointerover', () => {
      this.btnPlay.setTexture('sprBtnPlayHover');
      this.sfx.btnOver.play();
    }, this);

    this.btnPlay.on('pointerout', () => {
      this.btnPlay.setTexture('sprBtnPlay');
    });

    this.btnPlay.on('pointerdown', () => {
      this.btnPlay.setTexture('sprBtnPlayDown');
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay.on('pointerup', () => {
      this.btnPlay.setTexture('sprBtnPlay');
      this.scene.start('SceneMain');
    }, this);

    this.title = this.add.text(this.game.config.width * 0.5, 128, 'BIKE SHOOTER', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#000000',
      align: 'center',
    });

    this.title.setOrigin(0.5);
  }
}

export default SceneMainMenu;
