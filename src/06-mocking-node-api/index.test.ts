// Uncomment the code below and write your tests
// import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import path from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';
import fs, { promises } from 'fs';
let callback: jest.Mock<unknown, unknown[], unknown>;
let delay: number;

beforeEach(() => {
  callback = jest.fn();
  delay = 1000;
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spyTimeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, delay);
    expect(spyTimeout).toHaveBeenLastCalledWith(callback, delay); // the mock function was called with specific arguments
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, delay); // setTimepout
    expect(callback).not.toHaveBeenCalled(); // the mock function was not called
    jest.runOnlyPendingTimers(); // executes only the macro-tasks that are currently pending
    expect(callback).toHaveBeenCalledTimes(1); // the mock callback was called once
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spyInterval = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, delay);
    expect(spyInterval).toHaveBeenLastCalledWith(callback, delay);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(callback, delay);
    expect(callback).not.toHaveBeenCalled();
    Array(3)
      .fill(1)
      .forEach(() => {
        jest.advanceTimersByTime(delay); // All pending "macro tasks" must be completed within this 'delay' period
      });
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = './index.ts';
    const readFile = jest.fn(() => Promise.resolve());
    const spyJoin = jest.spyOn(path, 'join');
    jest.mock('fs/promises', () => ({ readFile }));
    await readFileAsynchronously(pathToFile);
    expect(spyJoin).toHaveBeenCalledWith(expect.any(String), pathToFile); // __dirname, './index.ts'
  });

  test('should return null if file does not exist', async () => {
    const existsSync = jest.fn().mockReturnValue(false);
    jest.mock('fs', () => ({ existsSync }));
    expect(await readFileAsynchronously('notexist.txt')).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = './index.ts';
    const fileContent = 'some text';
    jest.spyOn(promises, 'readFile').mockResolvedValue(fileContent);
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    expect(await readFileAsynchronously(pathToFile)).toBe(fileContent);
  });
});
