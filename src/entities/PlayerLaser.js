import Entity from './Entity';

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'sprLaserPlayer');
    this.body.velocity.y = -1000;
    this.setScale(5);
  }
}

export default PlayerLaser;
