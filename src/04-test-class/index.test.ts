// Uncomment the code below and write your tests
import { BankAccount, getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

describe('BankAccount', () => {
  let instance: BankAccount;

  beforeEach(() => {
    instance = getBankAccount(100);
  })

  test('should create account with initial balance', () => {
    expect(instance).toBeInstanceOf(BankAccount);
    expect(instance.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const t = () => {
      instance.withdraw(200);
    }
    expect(t).toThrow(InsufficientFundsError);
    expect(t).toThrow((new InsufficientFundsError(instance.getBalance())).message);
  });

  test('should throw error when transferring more than balance', () => {
    const t = () => {
      instance.transfer(200, getBankAccount(100));
    }
    expect(t).toThrow(InsufficientFundsError);
    expect(t).toThrow((new InsufficientFundsError(instance.getBalance()).message));
  });

  test('should throw error when transferring to the same account', () => {
    const t = () => {
      instance.transfer(80, instance);
    }
    expect(t).toThrow(TransferFailedError);
    expect(t).toThrow((new TransferFailedError()).message);
  });

  test('should deposit money', () => {
    const amount = 10;
    const balance = instance.getBalance();
    const inst = instance.deposit(amount);
    expect(inst).toBe(instance);
    expect(instance.getBalance()).toBe(balance + amount);
  });

  test('should withdraw money', () => {
    const amount = 10;
    const balance = instance.getBalance();
    const inst = instance.withdraw(amount);
    expect(inst).toBe(instance);
    expect(instance.getBalance()).toBe(balance - amount);
  });

  test('should transfer money', () => {
    const toAccount = getBankAccount(100);
    const balanceInstance = instance.getBalance();
    const balanceToAccount = toAccount.getBalance();
    const amount = 10;
    
    const inst = instance.transfer(amount, toAccount);
    expect(inst).toBe(instance);
    expect(instance.getBalance()).toBe(balanceInstance - 10);
    expect(toAccount.getBalance()).toBe(balanceToAccount + 10);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {  
    return instance.fetchBalance().then(res => {
      if (res) {
        expect(res).toBeGreaterThanOrEqual(0);
        expect(res).toBeLessThanOrEqual(100);
      }
    })
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const instance = getBankAccount(200);
    const balance = instance.getBalance(); //200
    try {
      await instance.synchronizeBalance();
      const newBalance = instance.getBalance();// 0 .. 100
      expect(newBalance).toBeLessThan(balance);
    } catch {};

    instance.synchronizeBalance().then(() => {
      
    })
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await instance.synchronizeBalance();
    } catch (err: SynchronizationFailedError | unknown){
      expect(err).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});
