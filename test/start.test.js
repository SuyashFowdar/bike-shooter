import loadGame from '../src/scenes/start';

test('Load form to start game', () => {
  loadGame();
  const form = document.getElementsByTagName('form')[0];
  expect(form).toBeInstanceOf(HTMLElement);
});
