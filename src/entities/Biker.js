import Phaser from 'phaser';
import Entity from './Entity';
import EnemyBullet from './EnemyBullet';

class Biker extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'bikerImg', 'Biker');

    this.shootTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(500, 3500),
      callback() {
        const enemyBullet = new EnemyBullet(
          this.scene,
          this.x,
          this.y,
        );
        this.scene.enemyBullets.add(enemyBullet);
      },
      callbackScope: this,
      loop: false,
    });
    this.soundEffect = this.scene.sound.add('bikeSound', { volume: 0.15 });
    this.soundEffect.play();
  }
}

export default Biker;
