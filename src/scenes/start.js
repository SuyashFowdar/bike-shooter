import Phaser from 'phaser';
import { loadGame } from '../logicController';
// eslint-disable-next-line import/no-cycle
import Game from './Game';

let playerName;

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

loadGame(form => {
  form.addEventListener('submit', (e) => { newGame(e); });
});

export { newGame, playerName };
