import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const config = {
    baseURL: 'https://jsonplaceholder.typicode.com',
  };

  const relativePath = 'api/users';
  const data = 'response';

  test('should create instance with provided base url', async () => {
    const spyCreate = jest.spyOn(axios, 'create');
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: null });
    await throttledGetDataFromApi(relativePath);
    jest.runOnlyPendingTimers();
    expect(spyCreate).toHaveBeenCalledWith(config);
  });

  test('should perform request to correct provided url', async () => {
    const spyGet = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: null });
    await throttledGetDataFromApi(relativePath);
    jest.runOnlyPendingTimers();
    expect(spyGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data });
    const res = await throttledGetDataFromApi(relativePath);
    jest.runOnlyPendingTimers();
    expect(res).toEqual(data);
  });
});
