import Phaser from 'phaser';
import Entity from './Entity';
import PlayerLaser from './PlayerLaser';

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'Player');

    this.setData('speed', 200);
    // this.play('sprPlayer');

    this.setData('isShooting', false);
    this.setData('enemyMissed', 0);
    this.setData('score', 0);
    this.setData('timerShootDelay', 10);
    this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
  }

  moveLeft() {
    this.body.velocity.x = -this.getData('speed');
  }

  moveRight() {
    this.body.velocity.x = this.getData('speed');
  }

  update() {
    // console.log(this.getData('isShooting'));
    this.body.setVelocity(0, 0);

    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData('isShooting') === true) {
      // if (this.getData('shoot')) {
        const laser = new PlayerLaser(this.scene, this.x, this.y - 50);
        this.scene.playerLasers.add(laser);
        this.setData('isShooting', false);
        this.setData('shot', true);
      // }
      // if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
      //   this.setData('timerShootTick', this.getData('timerShootTick') + 1);
      // } else {

      //   this.setData('timerShootTick', 0);
      // }
    }
  }

  onDestroy() {
    this.scene.time.addEvent({
      delay: 1000,
      callback() {
        this.scene.scene.start('SceneGameOver');
      },
      callbackScope: this,
      loop: false,
    });
  }
}

export default Player;
