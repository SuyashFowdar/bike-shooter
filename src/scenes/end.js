import { loadGame, loadGameOver } from '../logicController';
// eslint-disable-next-line import/no-cycle
import { newGame, getPlayerName } from './start';

const gameOver = (receivedScore) => {
  loadGameOver(receivedScore, getPlayerName(), button => {
    button.addEventListener('click', () => {
      document.body.innerHTML = '';
      loadGame(form => {
        form.addEventListener('submit', (e) => { newGame(e); });
      });
    });
  });
};

export default gameOver;
