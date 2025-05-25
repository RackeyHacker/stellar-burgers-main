import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('Тесты редюсера конструктора бургера', () => {
  const mockBun = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  };

  const mockIngredient = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  describe('Управление ингредиентами в конструкторе', () => {
    const baseState = {
      loading: false,
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('Добавление соуса в конструктор', () => {
      const updatedState = constructorSlice(baseState, addIngredient(mockIngredient));
      const addedIngredient = updatedState.constructorItems.ingredients[0];

      expect(addedIngredient).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
    });

    test('Добавление булки в конструктор', () => {
      const updatedState = constructorSlice(baseState, addIngredient(mockBun));

      expect(updatedState.constructorItems.bun).toMatchObject({
        ...mockBun,
        id: expect.any(String)
      });
    });

    test('Замена существующей булки на новую', () => {
      const stateWithBun = {
        ...baseState,
        constructorItems: {
          bun: {
            ...mockBun,
            id: 'test-id-1',
            name: 'Старая булка'
          },
          ingredients: []
        }
      };

      const newBun = {
        ...mockBun,
        name: 'Новая булка'
      };

      const updatedState = constructorSlice(stateWithBun, addIngredient(newBun));

      expect(updatedState.constructorItems.bun).toMatchObject({
        ...newBun,
        id: expect.any(String)
      });
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    const stateWithIngredient = {
      loading: false,
      constructorItems: {
        bun: null,
        ingredients: [{
          ...mockIngredient,
          id: 'test-ingredient-id'
        }]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('Удаление ингредиента по ID', () => {
      const updatedState = constructorSlice(
        stateWithIngredient,
        removeIngredient('test-ingredient-id')
      );

      expect(updatedState.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    const stateWithIngredients = {
      loading: false,
      constructorItems: {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'ing-1', name: 'Первый соус' },
          { ...mockIngredient, id: 'ing-2', name: 'Второй соус' },
          { ...mockIngredient, id: 'ing-3', name: 'Третий соус' }
        ]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('Перемещение ингредиента вверх', () => {
      const updatedState = constructorSlice(stateWithIngredients, moveIngredientUp(2));
      const ingredients = updatedState.constructorItems.ingredients;

      expect(ingredients[1].id).toBe('ing-3');
      expect(ingredients[2].id).toBe('ing-2');
    });

    test('Перемещение ингредиента вниз', () => {
      const updatedState = constructorSlice(stateWithIngredients, moveIngredientDown(0));
      const ingredients = updatedState.constructorItems.ingredients;

      expect(ingredients[0].id).toBe('ing-2');
      expect(ingredients[1].id).toBe('ing-1');
    });
  });

  describe('Обработка заказа бургера', () => {
    const mockActions = {
      pending: {
        type: orderBurger.pending.type,
        payload: undefined
      },
      rejected: {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка при создании заказа' }
      },
      fulfilled: {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 12345 } }
      }
    };

    test('Начало обработки заказа', () => {
      const updatedState = constructorSlice(initialState, mockActions.pending);

      expect(updatedState.loading).toBe(true);
      expect(updatedState.error).toBeNull();
      expect(updatedState.orderRequest).toBe(true);
    });

    test('Ошибка при обработке заказа', () => {
      const updatedState = constructorSlice(initialState, mockActions.rejected);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
      expect(updatedState.orderRequest).toBe(false);
    });

    test('Успешное оформление заказа', () => {
      const updatedState = constructorSlice(initialState, mockActions.fulfilled);

      expect(updatedState.loading).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.orderModalData?.number).toBe(12345);
      expect(updatedState.constructorItems.bun).toBeNull();
      expect(updatedState.constructorItems.ingredients).toHaveLength(0);
    });
  });
});
