import Phaser from 'phaser';
// eslint-disable-next-line import/no-cycle
import Player from '../entities/Player';
import Biker from '../entities/Biker';
import loadGame from './start';

let playerName;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    this.load.image('bg', 'assets/img/bg.png');
    this.load.spritesheet('sprExplosion', 'assets/img/sprExplosion.png', {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.image('bikerImg', 'assets/img/biker.png');
    this.load.image('bulletImg', 'assets/img/bullet.png');
    this.load.image('player', 'assets/img/gun.png');

    this.load.audio('bulletSound', 'assets/snd/gun.mp3');
    this.load.audio('bikeSound', 'assets/snd/bike.mp3');
  }

  create() {
    const img = this.add.image(this.game.config.width * 0.4, this.game.config.height * 0.4, 'bg');
    img.setScale(0.85);

    this.anims.create({
      key: 'sprExplosion',
      frames: this.anims.generateFrameNumbers('sprExplosion'),
      frameRate: 20,
      repeat: 0,
    });

    this.sfx = {
      bullet: this.sound.add('bulletSound'),
    };

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height - 115,
      'player',
    );

    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.enemies = this.add.group();
    this.bullets = this.add.group();
    this.enemyBullets = this.add.group();

    setTimeout(() => {
      this.time.addEvent({
        delay: 2000,
        callback() {
          let enemy = null;
          if (Phaser.Math.Between(1, 2) === 1) {
            if (this.enemies.getChildren().length < 5) {
              enemy = new Biker(
                this,
                0,
                Phaser.Math.Between(300, this.game.config.height - 300),
              );
              enemy.body.velocity.x = 250;
              enemy.setData('fromLeft', true);
            }
          } else if (this.enemies.getChildren().length < 5) {
            enemy = new Biker(
              this,
              this.game.config.width,
              Phaser.Math.Between(300, this.game.config.height - 300),
            );
            enemy.body.velocity.x = -250;
            enemy.flipX = true;
          }

          if (enemy !== null) {
            enemy.setScale(enemy.y * 0.002);
            this.enemies.add(enemy);
          }

          this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            if (enemy) {
              if (enemy.onDestroy !== undefined) {
                enemy.onDestroy();
              }
              enemy.explode(true);
              bullet.destroy();
              this.player.setData('score', this.player.getData('score') + 1);
              this.score.setText(this.player.getData('score'));
            }
          });

          this.physics.add.collider(this.enemyBullets, this.player, (bullet, player) => {
            if (player) {
              player.explode(true);
              bullet.destroy();
              if (player.onDestroy !== undefined) {
                player.onDestroy(playerName);
              }
            }
          });
        },
        callbackScope: this,
        loop: true,
      });
    }, 200);

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

    this.enemyText = this.add.text(this.game.config.width - 200, 20, 'Allowed Escapes', {
      fontFamily: 'monospace',
      fontSize: 20,
      fontStyle: 'bold',
      color: '#000000',
      align: 'right',
    });

    this.enemyMissed = this.add.text(this.game.config.width - 50, 50, '5', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#000000',
      align: 'right',
    });
  }

  update() {
    if (this.player.getData('isDead') === false) {
      this.player.update();

      if (this.keyLeft.isDown) {
        this.player.moveLeft();
      } else if (this.keyRight.isDown) {
        this.player.moveRight();
      }

      if (this.keyUp.isDown) {
        this.player.moveUp();
      } else if (this.keyDown.isDown) {
        this.player.moveDown();
      }

      if (this.keySpace.isDown) {
        if (!this.player.getData('shot')) {
          this.player.setData('isShooting', true);
        }
      } else if (this.keySpace.isUp) {
        this.player.setData('shot', false);
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
              this.enemyMissed.setText(5 - this.player.getData('enemyMissed'));
              if (this.player.getData('enemyMissed') === 5) {
                this.player.onDestroy(playerName);
              }
            }
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }

            enemy.destroy();
          }
        }
      }

      for (let i = 0; i < this.bullets.getChildren().length; i += 1) {
        const bullet = this.bullets.getChildren()[i];
        bullet.update();

        if (bullet.x < -bullet.displayWidth
          || bullet.x > this.game.config.width + bullet.displayWidth
          || bullet.y < -bullet.displayHeight * 4
          || bullet.y > this.game.config.height + bullet.displayHeight) {
          if (bullet) {
            bullet.destroy();
          }
        }
      }

      for (let i = 0; i < this.enemyBullets.getChildren().length; i += 1) {
        const enemyBullet = this.enemyBullets.getChildren()[i];
        enemyBullet.update();

        if (enemyBullet.x < -enemyBullet.displayWidth
          || enemyBullet.x > this.game.config.width + enemyBullet.displayWidth
          || enemyBullet.y < -enemyBullet.displayHeight * 4
          || enemyBullet.y > this.game.config.height + enemyBullet.displayHeight) {
          if (enemyBullet) {
            enemyBullet.destroy();
          }
        }
      }
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  backgroundColor: 'transparent',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: Game,
  pixelArt: true,
  roundPixels: true,
  'render.transparent': true,
};

const newGame = (e) => {
  e.preventDefault();
  if (e.target.name && e.target.name.value) {
    playerName = e.target.name.value;
    document.body.innerHTML = '';
    // eslint-disable-next-line no-new
    new Phaser.Game(config);
    document.getElementsByTagName('canvas')[0].style.animationName = 'appear';
  }
};

const loadNewGame = () => {
  loadGame(newGame);
};

loadGame(newGame);

export { Game, loadNewGame };
