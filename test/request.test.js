import 'jest-fix-undefined';
import { getRequest } from '../src/logicController';

test('Check request method with GET', () => {
  const req = getRequest('GET');
  expect(req.method).toEqual('GET');
});

test('Check valid request with method GET', () => {
  const req = getRequest('GET');
  expect(req).toBeInstanceOf(Request);
});

test('Check request method with GET', () => {
  const req = getRequest('POST', { name: 'Name', score: 10 });
  expect(req.method).toEqual('POST');
});

test('Check valid request with method GET', () => {
  const req = getRequest('POST', { name: 'Name', score: 10 });
  expect(req).toBeInstanceOf(Request);
});
