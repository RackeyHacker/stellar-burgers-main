import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('Тестирование функционала ленты заказов', () => {
  describe('Обработка асинхронных запросов к API', () => {
    const mockActions = {
      pending: {
        type: getFeeds.pending.type,
        payload: undefined
      },
      rejected: {
        type: getFeeds.rejected.type,
        error: { message: 'Ошибка загрузки ленты заказов' }
      },
      fulfilled: {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: [
            { id: '1', name: 'Тестовый заказ 1', status: 'done' },
            { id: '2', name: 'Тестовый заказ 2', status: 'pending' }
          ],
          total: 100,
          totalToday: 42
        }
      }
    };

    test('Состояние при начале загрузки данных', () => {
      const updatedState = feedSlice(initialState, mockActions.pending);

      expect(updatedState.loading).toBe(true);
      expect(updatedState.error).toBeNull();
    });

    test('Состояние при ошибке загрузки', () => {
      const updatedState = feedSlice(initialState, mockActions.rejected);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
      expect(updatedState.orders).toHaveLength(0);
    });

    test('Состояние при успешной загрузке', () => {
      const updatedState = feedSlice(initialState, mockActions.fulfilled);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.orders).toEqual(mockActions.fulfilled.payload.orders);
      expect(updatedState.total).toBe(mockActions.fulfilled.payload.total);
      expect(updatedState.totalToday).toBe(mockActions.fulfilled.payload.totalToday);
    });
  });
});
