import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('Тестирование менеджера заказов', () => {
  describe('Обработка запросов к API заказов', () => {
    const mockOrder = {
      _id: '12345',
      number: 12345,
      name: 'Космический бургер',
      status: 'done',
      createdAt: '2024-04-20T12:00:00.000Z',
      updatedAt: '2024-04-20T12:05:00.000Z',
      ingredients: ['ingredient1', 'ingredient2']
    };

    const mockActions = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: undefined
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Ошибка получения данных заказа' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      }
    };

    test('Инициализация запроса заказа', () => {
      const updatedState = orderSlice(initialState, mockActions.pending);

      expect(updatedState.request).toBe(true);
      expect(updatedState.error).toBeNull();
      expect(updatedState.orderByNumberResponse).toBeNull();
    });

    test('Обработка ошибки получения заказа', () => {
      const updatedState = orderSlice(initialState, mockActions.rejected);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
      expect(updatedState.orderByNumberResponse).toBeNull();
    });

    test('Успешное получение данных заказа', () => {
      const updatedState = orderSlice(initialState, mockActions.fulfilled);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.orderByNumberResponse).toEqual(mockOrder);
      expect(updatedState.orderByNumberResponse?.number).toBe(12345);
      expect(updatedState.orderByNumberResponse?.status).toBe('done');
      expect(updatedState.orderByNumberResponse?.ingredients).toHaveLength(2);
    });
  });
});
