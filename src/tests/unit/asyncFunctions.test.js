// Асинхронные функции для тестирования
export async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUserData(userId) {
  await timeout(100); // Имитация задержки сети
  if (userId === 1) {
    return { id: 1, name: 'John Doe', email: 'john@example.com' };
  }
  throw new Error('User not found');
}

// Тесты
describe('Async functions', () => {
  // Mock fetch для тестирования
  global.fetch = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetchData returns data on successful request', async () => {
    const mockData = { id: 1, title: 'Test' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchData('https://api.example.com/data');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data');
  });

  test('fetchData throws error on failed request', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchData('https://api.example.com/invalid'))
      .rejects
      .toThrow('HTTP error! status: 404');
  });

  test('getUserData returns user data for valid ID', async () => {
    const user = await getUserData(1);
    expect(user).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  test('getUserData throws error for invalid ID', async () => {
    await expect(getUserData(999)).rejects.toThrow('User not found');
  });

  test('timeout resolves after specified time', async () => {
    jest.useFakeTimers();

    const promise = timeout(1000);
    jest.advanceTimersByTime(1000);

    await expect(promise).resolves.toBeUndefined();

    jest.useRealTimers();
  });
});