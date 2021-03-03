import el from './library';

const getRequest = (type, body) => {
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/rx8Uv4eaK8jKB03z267T/scores/';

  const config = {
    method: type,
  };

  if (type === 'POST') {
    config.headers = {
      'Content-Type': 'application/json',
    };
    config.mode = 'cors';
    config.body = JSON.stringify(body);
  }

  return new Request(url, config);
};

const activateButton = (e) => {
  const start = document.getElementsByClassName('start-button')[0];
  if (e.target.value) {
    start.removeAttribute('disabled');
  } else {
    start.setAttribute('disabled', true);
  }
};

const loadGame = (cb) => {
  el(document.body, { t: 'h1', c: 'Bike Shooter' });
  el(document.body, { t: 'form', a: [['class', 'col']] }, form => {
    el(form, { t: 'input', e: [{ type: 'keyup', func: activateButton }], a: [['class', 'name-input margin8 padding8'], ['type', 'text'], ['name', 'name'], ['placeholder', 'Put your name to start'], ['required', true]] });
    el(form, { t: 'button', c: 'Start Game', a: [['class', 'start-button margin8'], ['disabled', true], ['type', 'submit']] });
    if (cb) {
      cb(form);
    }
  });
};

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
        game.sort((a, b) => b.score - a.score);
        for (let i = 0; i < 15; i += 1) {
          el(board, { t: 'div', a: [['class', 'row margin8']] }, playerEl => {
            el(playerEl, { t: 'div', a: [['class', 'w-50']], c: game[i].user });
            el(playerEl, { t: 'div', a: [['class', 'w-50']], c: game[i].score });
          });
        }
      }
    });
};

const postToLeaderBoard = (playerName, score) => {
  fetch(getRequest('POST', { user: playerName, score }))
    .then(() => { getLeaderBoard(); });
};

const loadGameOver = (receivedScore, playerName, cb) => {
  document.body.innerHTML = '';
  el(document.body, { t: 'h1', c: 'Bike Shooter' });
  el(document.body, { t: 'div', a: [['class', 'score-container col cross-center w-40']] }, scoreContainer => {
    el(scoreContainer, { t: 'h2', c: `Score: ${receivedScore}` });
    el(scoreContainer, { t: 'div', a: [['class', 'leader-board w-100 col'], ['id', 'leader-board']] }, leaderBoard => {
      if (playerName) {
        if (receivedScore) {
          postToLeaderBoard(playerName, receivedScore);
        } else {
          getLeaderBoard();
        }
      }
      el(leaderBoard, { t: 'h3', c: 'Loading...' });
    });
  });
  el(document.body, { t: 'button', c: 'Restart Game', a: [['class', 'start-button margin8']] }, button => {
    if (cb) {
      cb(button);
    }
  });
};

const setPlayerData = (player) => {
  player.setData('speed', 600);
  player.setData('isShooting', false);
  player.setData('enemyMissed', 0);
  player.setData('score', 0);
  player.setData('timerShootDelay', 10);
  player.setData('timerShootTick', player.getData('timerShootDelay') - 1);
};

export {
  getRequest, loadGame, loadGameOver, getLeaderBoard, setPlayerData,
};
