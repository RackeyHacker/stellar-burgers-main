import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('Тестирование менеджера состояния ингредиентов', () => {
  describe('Обработка запросов к API ингредиентов', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Булка для бургера',
        type: 'bun',
        proteins: 10,
        fat: 15,
        carbohydrates: 30,
        calories: 250,
        price: 50,
        image: 'bun.png',
        image_mobile: 'bun-mobile.png',
        image_large: 'bun-large.png'
      },
      {
        _id: '2',
        name: 'Котлета говяжья',
        type: 'main',
        proteins: 25,
        fat: 20,
        carbohydrates: 5,
        calories: 300,
        price: 100,
        image: 'patty.png',
        image_mobile: 'patty-mobile.png',
        image_large: 'patty-large.png'
      }
    ];

    const mockActions = {
      pending: {
        type: getIngredients.pending.type,
        payload: undefined
      },
      rejected: {
        type: getIngredients.rejected.type,
        error: { message: 'Ошибка загрузки списка ингредиентов' }
      },
      fulfilled: {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      }
    };

    test('Инициализация загрузки ингредиентов', () => {
      const updatedState = ingredientSlice(initialState, mockActions.pending);

      expect(updatedState.loading).toBe(true);
      expect(updatedState.error).toBeNull();
      expect(updatedState.ingredients).toHaveLength(0);
    });

    test('Обработка ошибки загрузки', () => {
      const updatedState = ingredientSlice(initialState, mockActions.rejected);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
      expect(updatedState.ingredients).toHaveLength(0);
    });

    test('Успешная загрузка ингредиентов', () => {
      const updatedState = ingredientSlice(initialState, mockActions.fulfilled);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.ingredients).toEqual(mockIngredients);
      expect(updatedState.ingredients).toHaveLength(2);
      expect(updatedState.ingredients[0].type).toBe('bun');
      expect(updatedState.ingredients[1].type).toBe('main');
    });
  });
});
