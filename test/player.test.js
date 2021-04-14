import { setPlayerData } from '../src/logicController';

const player = {
  setData(attr, data) {
    player[attr] = data;
  },
  getData(attr) {
    return player[attr];
  },
};

setPlayerData(player);

test('Player speed', () => {
  expect(player.speed).toEqual(600);
});

test('Player isShooting', () => {
  expect(player.isShooting).toEqual(false);
});

test('Player enemyMissed', () => {
  expect(player.enemyMissed).toEqual(0);
});

test('Player timerShootDelay', () => {
  expect(player.timerShootDelay).toEqual(10);
});

test('Player timerShootTick', () => {
  expect(player.timerShootTick).toEqual(9);
});
