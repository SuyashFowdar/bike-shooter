import { el, getRequest } from '../library';
// eslint-disable-next-line import/no-cycle
import { loadNewGame } from './Game';

let score = 0;

const getLeaderBoard = () => {
  fetch(getRequest('GET'))
    .then(response => response.json())
    .then(response => {
      const board = document.getElementById('leader-board');
      if (response.message) {
        board.innerHTML = `<h3 class="error">${response.message}</h3>`;
      } else {
        const game = response.result;
        board.innerHTML = '';
        for (let i = game.length - 1; i > -1; i -= 1) {
          el(board, { t: 'div', a: [['class', 'row margin8']] }, playerEl => {
            el(playerEl, { t: 'div', a: [['class', 'w-50']], c: game[i].user });
            el(playerEl, { t: 'div', a: [['class', 'w-50']], c: game[i].score });
          });
        }
      }
    });
};

const postToLeaderBoard = (playerName) => {
  fetch(getRequest('POST', { user: playerName, score }))
    .then(() => { getLeaderBoard(); });
};

const restart = () => {
  document.body.innerHTML = '';
  // loadGame(newGame);
  loadNewGame();
};

const gameOver = (receivedScore, playerName) => {
  score = receivedScore;
  document.body.innerHTML = '';
  el(document.body, { t: 'h1', c: 'Bike Shooter' });
  el(document.body, { t: 'div', a: [['class', 'score-container col cross-center w-40']] }, scoreContainer => {
    el(scoreContainer, { t: 'h2', c: `Score: ${score}` });
    el(scoreContainer, { t: 'div', a: [['class', 'leader-board w-100 col'], ['id', 'leader-board']] }, leaderBoard => {
      if (score) {
        postToLeaderBoard(playerName);
      } else {
        getLeaderBoard();
      }
      el(leaderBoard, { t: 'h3', c: 'Loading...' });
    });
  });
  el(document.body, {
    t: 'button', c: 'Restart Game', a: [['class', 'start-button margin8']], e: [{ type: 'click', func: restart }],
  });
};

export default gameOver;
