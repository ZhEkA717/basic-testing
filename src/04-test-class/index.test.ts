// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let instance: BankAccount;

  beforeEach(() => {
    instance = getBankAccount(100);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(instance).toBeInstanceOf(BankAccount);
    expect(instance.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const t = () => {
      instance.withdraw(200);
    };
    expect(t).toThrow(InsufficientFundsError);
    expect(t).toThrow(
      new InsufficientFundsError(instance.getBalance()).message,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const t = () => {
      instance.transfer(200, getBankAccount(100));
    };
    expect(t).toThrow(InsufficientFundsError);
    expect(t).toThrow(
      new InsufficientFundsError(instance.getBalance()).message,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const t = () => {
      instance.transfer(80, instance);
    };
    expect(t).toThrow(TransferFailedError);
    expect(t).toThrow(new TransferFailedError().message);
  });

  test('should deposit money', () => {
    const inst = instance.deposit(10);
    expect(inst).toBe(instance);
    expect(instance.getBalance()).toBe(110);
  });

  test('should withdraw money', () => {
    const inst = instance.withdraw(10);
    expect(inst).toBe(instance);
    expect(instance.getBalance()).toBe(90);
  });

  test('should transfer money', () => {
    const instance1 = getBankAccount(100);
    const instance2 = getBankAccount(140);
    instance2.transfer(40, instance1);
    expect(instance1.getBalance()).toBe(140);
    expect(instance2.getBalance()).toBe(100);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(instance, 'fetchBalance').mockResolvedValue(10);
    const res = await instance.fetchBalance();
    expect(typeof res).toBe('number');
    expect(res).toBe(10);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(instance, 'fetchBalance').mockResolvedValue(150);
    await instance.synchronizeBalance();
    expect(instance.getBalance()).toBe(150);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(instance, 'fetchBalance').mockResolvedValue(null);
    expect(() => instance.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
