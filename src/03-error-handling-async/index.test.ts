// Uncomment the code below and write your tests
import { throwError, resolveValue, throwCustomError, MyAwesomeError, rejectCustomError } from "03-error-handling-async";

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = "Hello world!";
    await expect(resolveValue(value)).resolves.toEqual(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'provided message';
    const t = () => {
        throwError(errorMessage);
    };
    expect(t).toThrow(Error);
    expect(t).toThrow(errorMessage);
  });

 

  test('should throw error with default message if message is not provided', () => {
      const t = () => {
        throwError();
      };
      expect(t).toThrow(Error);
      expect(t).toThrow('Oops');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const t = () => {
      throwCustomError();
    }
    expect(t).toThrow(MyAwesomeError);
    expect(t).toThrow((new MyAwesomeError).message);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const res = expect(rejectCustomError()).rejects;
    await res.toThrow(MyAwesomeError);
    await res.toThrow((new MyAwesomeError()).message);
  });
});
