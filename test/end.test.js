import el from '../src/library';
import { loadGameOver } from '../src/logicController';

document.body.classList.add('col', 'main-center', 'cross-center');
loadGameOver();

test('Load leader board upon request', () => {
  const board = document.getElementById('leader-board');
  expect(board).toBeInstanceOf(HTMLElement);
});
