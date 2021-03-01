import Entity from './Entity';

class Bullet extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'bulletImg');
    this.scene.sfx.bullet.play();
    this.body.velocity.y = -1000;
    this.setScale(5);
  }
}

export default Bullet;
