import 'jest-fix-undefined';
import { loadGameOver, getLeaderBoard } from '../src/logicController';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ result: [{ score: 5, user: 'John' }] }),
}));

beforeEach(() => {
  fetch.mockClear();
});

document.body.classList.add('col', 'main-center', 'cross-center');
loadGameOver();

test('Load leader board upon request', () => {
  const board = document.getElementById('leader-board');
  expect(board).toBeInstanceOf(HTMLElement);
});

test('Get leader board data', async () => {
  const response = await getLeaderBoard();
  expect(response.result).toEqual([{ score: 5, user: 'John' }]);
});

test('Load leader board with data', async () => {
  await getLeaderBoard();
  expect(document.getElementsByClassName('w-50').length).toEqual(2);
});
