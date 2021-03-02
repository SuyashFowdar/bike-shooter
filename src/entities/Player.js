import Phaser from 'phaser';
import Entity from './Entity';
import Bullet from './Bullet';
// eslint-disable-next-line import/no-cycle
import gameOver from '../scenes/end';

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'Player');

    this.setData('speed', 600);
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

  moveUp() {
    this.body.velocity.y = -this.getData('speed');
  }

  moveDown() {
    this.body.velocity.y = this.getData('speed');
  }

  update() {
    if (this.body) {
      this.body.setVelocity(0, 0);

      this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
      this.y = Phaser.Math.Clamp(
        this.y,
        this.scene.game.config.height - 100,
        this.scene.game.config.height,
      );

      if (this.getData('isShooting') === true) {
        const bullet = new Bullet(this.scene, this.x, this.y - 50);
        this.scene.bullets.add(bullet);
        this.setData('isShooting', false);
        this.setData('shot', true);
      }
    }
  }

  onDestroy(playerName) {
    this.scene.time.addEvent({
      delay: 500,
      callback() {
        gameOver(this.getData('score'), playerName);
        this.scene.game.destroy();
      },
      callbackScope: this,
      loop: false,
    });
  }
}

export default Player;
