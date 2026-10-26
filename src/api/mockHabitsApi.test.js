import { afterEach } from '@jest/globals';
import { mockHabitsApi } from './mockHabitsApi';

afterEach(() => jest.useRealTimers());

describe('mock habits API', () => {
  beforeEach(() => mockHabitsApi.reset());

  it('returns a delayed list and updates habit completion', async () => {
    jest.useFakeTimers();
    const listRequest = mockHabitsApi.list();
    jest.runAllTimers();
    const habits = await listRequest;
    expect(habits).toHaveLength(4);

    const toggleRequest = mockHabitsApi.toggle('walk');
    jest.runAllTimers();
    await expect(toggleRequest).resolves.toMatchObject({ id: 'walk', completed: true });
    jest.useRealTimers();
  });

  it('creates a habit and rejects an unknown id', async () => {
    jest.useFakeTimers();
    const createRequest = mockHabitsApi.create(' Растяжка ');
    jest.runAllTimers();
    await expect(createRequest).resolves.toMatchObject({ title: 'Растяжка', category: 'Моё' });
    const missingRequest = mockHabitsApi.toggle('missing');
    jest.runAllTimers();
    await expect(missingRequest).rejects.toThrow('Привычка не найдена');
    jest.useRealTimers();
  });
});
