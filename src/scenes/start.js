import { el } from '../library';

const activateButton = (e) => {
  const start = document.getElementsByClassName('start-button')[0];
  if (e.target.value) {
    start.removeAttribute('disabled');
  } else {
    start.setAttribute('disabled', true);
  }
};

const loadGame = (newGame) => {
  el(document.body, { t: 'h1', c: 'Bike Shooter' });
  el(document.body, { t: 'form', e: [{ type: 'submit', func: newGame }], a: [['class', 'col']] }, form => {
    el(form, { t: 'input', e: [{ type: 'keyup', func: activateButton }], a: [['class', 'name-input margin8 padding8'], ['type', 'text'], ['name', 'name'], ['placeholder', 'Put your name to start'], ['required', true]] });
    el(form, { t: 'button', c: 'Start Game', a: [['class', 'start-button margin8'], ['disabled', true], ['type', 'submit']] });
  });
};

export default loadGame;
