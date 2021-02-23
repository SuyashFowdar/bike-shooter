import Phaser from 'phaser';
import Player from '../entities/Player';
import GunShip from '../entities/GunShip';
import CarrierShip from '../entities/CarrierShip';
import ChaserShip from '../entities/ChaserShip';
import ScrollingBackground from '../entities/ScrollingBackground';

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }

  preload() {
    this.load.image('sprBg0', 'content/sprBg0.png');
    this.load.image('bg', 'content/bg.jpg');
    this.load.image('sprBg1', 'content/sprBg1.png');
    this.load.spritesheet('sprExplosion', 'content/sprExplosion.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('sprEnemy0', 'content/sprEnemy0.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('sprEnemy1', 'content/biker.png');
    this.load.spritesheet('sprEnemy2', 'content/sprEnemy2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('sprLaserEnemy0', 'content/sprLaserEnemy0.png');
    this.load.image('sprLaserPlayer', 'content/sprLaserEnemy0.png');
    this.load.image('player', 'content/gun.png');
    this.load.spritesheet('sprPlayer', 'content/sprPlayer.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.audio('sndExplode0', 'content/sndExplode0.wav');
    this.load.audio('sndExplode1', 'content/sndExplode1.wav');
    this.load.audio('sndLaser', 'content/gun.mp3');
  }

  create() {
    this.anims.create({
      key: 'sprEnemy0',
      frames: this.anims.generateFrameNumbers('sprEnemy0'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'sprEnemy2',
      frames: this.anims.generateFrameNumbers('sprEnemy2'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'sprExplosion',
      frames: this.anims.generateFrameNumbers('sprExplosion'),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'sprPlayer',
      frames: this.anims.generateFrameNumbers('sprPlayer'),
      frameRate: 20,
      repeat: -1,
    });

    this.sfx = {
      explosions: [
        this.sound.add('sndExplode0'),
        this.sound.add('sndExplode1'),
      ],
      laser: this.sound.add('sndLaser'),
    };

    // this.backgrounds = [];
    // for (let i = 0; i < 5; i += 1) {
    //   const bg = new ScrollingBackground(this, 'sprBg0', i * 10);
    //   this.backgrounds.push(bg);
    // }

    this.add.image(400, 300, 'bg');
    // this.cameras.main.setBackgroundColor('#ffffff')

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height - 115,
      'player',
    );

    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.time.addEvent({
      delay: 2000,
      callback() {
        let enemy = null;
        // if (Phaser.Math.Between(0, 10) >= 3) {
        //   enemy = new GunShip(
        //     this,
        //     Phaser.Math.Between(0, this.game.config.width),
        //     0,
        //   );
        // } else if (Phaser.Math.Between(0, 10) >= 5) {
        if (Phaser.Math.Between(1, 2) == 1) {
          if (this.getEnemiesByType('ChaserShip').length < 5) {
            enemy = new ChaserShip(
              this,
              0,
              Phaser.Math.Between(600, this.game.config.height - 300),
            );
            enemy.body.velocity.x = 200;
            enemy.setData('fromLeft', true);
          }
        } else {
          if (this.getEnemiesByType('ChaserShip').length < 5) {
            enemy = new ChaserShip(
              this,
              this.game.config.width,
              Phaser.Math.Between(200, this.game.config.height - 300),
            );
            enemy.body.velocity.x = -200;
            enemy.flipX = true;
          }
        }
        // } else {
        //   enemy = new CarrierShip(
        //     this,
        //     Phaser.Math.Between(0, this.game.config.width),
        //     0,
        //   );
        // }

        if (enemy !== null) {
          enemy.setScale(enemy.y * 0.0001);
          this.enemies.add(enemy);
        }

        this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy) => {
          if (enemy) {
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
            enemy.explode(true);
            playerLaser.destroy();
            this.player.setData('score', this.player.getData('score') + 1);
            this.score.setText(this.player.getData('score'));
          }
        });
      },
      callbackScope: this,
      loop: true,
    });

    this.scoreText = this.add.text(50, 20, 'Score', {
      fontFamily: 'monospace',
      fontSize: 20,
      fontStyle: 'bold',
      color: '#000000',
      align: 'center',
    });

    this.score = this.add.text(50, 50, '0', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#000000',
      align: 'center',
    });

    this.enemyText = this.add.text(this.game.config.width - 165, 20, 'Enemy Missed', {
      fontFamily: 'monospace',
      fontSize: 20,
      fontStyle: 'bold',
      color: '#000000',
      align: 'right',
    });

    this.enemyMissed = this.add.text(this.game.config.width - 50, 50, '0', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#000000',
      align: 'right',
    });
  }

  update() {
    if (!this.player.getData('isDead')) {
      this.player.update();

      if (this.keyLeft.isDown) {
        this.player.moveLeft();
      } else if (this.keyRight.isDown) {
        this.player.moveRight();
      }

      if (this.keySpace.isDown) {
        if (!this.player.getData('shot')) {
          this.sfx.laser.play();
          this.player.setData('isShooting', true);
        }
      } else if (this.keySpace.isUp) {
        this.player.setData('shot', false);
      }
    }

    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];

      enemy.update();

      if (enemy.x < -enemy.displayWidth
        || enemy.x > this.game.config.width + enemy.displayWidth
        || enemy.y < -enemy.displayHeight * 4
        || enemy.y > this.game.config.height + enemy.displayHeight) {
        if (enemy) {
          if ((enemy.getData('fromLeft') && enemy.x > this.game.config.width + enemy.displayWidth) || (enemy.x < -enemy.displayWidth)) {
            this.player.setData('enemyMissed', this.player.getData('enemyMissed') + 1);
            this.enemyMissed.setText(this.player.getData('enemyMissed'));
            if (this.player.getData('enemyMissed') == 5) {
              this.player.onDestroy();
            }
          }
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }

          enemy.destroy();
        }
      }
    }

    for (let i = 0; i < this.enemyLasers.getChildren().length; i += 1) {
      const laser = this.enemyLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i += 1) {
      const laser = this.playerLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    // for (let i = 0; i < this.backgrounds.length; i += 1) {
    //   this.backgrounds[i].update();
    // }
  }

  getEnemiesByType(type) {
    const arr = [];
    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];
      if (enemy.getData('type') === type) {
        arr.push(enemy);
      }
    }
    return arr;
  }
}

export default SceneMain;
