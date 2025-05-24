import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('Тестирование менеджера пользовательских данных', () => {
  const mockUser = {
    name: 'Джон Доу',
    email: 'john.doe@example.com'
  };

  describe('Получение данных пользователя', () => {
    const mockActions = {
      pending: {
        type: getUser.pending.type,
        payload: undefined
      },
      rejected: {
        type: getUser.rejected.type,
        payload: undefined
      },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('Инициализация запроса данных пользователя', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.loginUserRequest).toBe(true);
    });

    test('Обработка ошибки получения данных', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.isAuthenticated).toBe(false);
      expect(updatedState.isAuthChecked).toBe(false);
      expect(updatedState.loginUserRequest).toBe(false);
    });

    test('Успешное получение данных пользователя', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.loginUserRequest).toBe(false);
      expect(updatedState.userData).toEqual(mockUser);
    });
  });

  describe('Управление заказами пользователя', () => {
    const mockOrders = [
      {
        _id: 'order1',
        number: 1234,
        name: 'Космический бургер',
        status: 'done',
        ingredients: ['ingredient1', 'ingredient2']
      },
      {
        _id: 'order2',
        number: 1235,
        name: 'Галактический бургер',
        status: 'pending',
        ingredients: ['ingredient3', 'ingredient4']
      }
    ];

    const mockActions = {
      pending: {
        type: getOrdersAll.pending.type,
        payload: undefined
      },
      rejected: {
        type: getOrdersAll.rejected.type,
        error: { message: 'Ошибка загрузки заказов' }
      },
      fulfilled: {
        type: getOrdersAll.fulfilled.type,
        payload: mockOrders
      }
    };

    test('Инициализация загрузки заказов', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.request).toBe(true);
      expect(updatedState.error).toBeNull();
    });

    test('Обработка ошибки загрузки заказов', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
    });

    test('Успешная загрузка заказов', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.userOrders).toEqual(mockOrders);
      expect(updatedState.userOrders).toHaveLength(2);
    });
  });

  describe('Процесс регистрации пользователя', () => {
    const mockActions = {
      pending: {
        type: registerUser.pending.type,
        payload: undefined
      },
      rejected: {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка регистрации' }
      },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('Инициализация процесса регистрации', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.request).toBe(true);
      expect(updatedState.error).toBeNull();
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.isAuthenticated).toBe(false);
    });

    test('Обработка ошибки регистрации', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
      expect(updatedState.isAuthChecked).toBe(false);
    });

    test('Успешная регистрация', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.userData).toEqual(mockUser);
      expect(updatedState.isAuthenticated).toBe(true);
    });
  });

  describe('Процесс авторизации пользователя', () => {
    const mockActions = {
      pending: {
        type: loginUser.pending.type,
        payload: undefined
      },
      rejected: {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка авторизации' }
      },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('Инициализация процесса авторизации', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.loginUserRequest).toBe(true);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.isAuthenticated).toBe(false);
      expect(updatedState.error).toBeNull();
    });

    test('Обработка ошибки авторизации', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.isAuthChecked).toBe(false);
      expect(updatedState.loginUserRequest).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
    });

    test('Успешная авторизация', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.isAuthChecked).toBe(false);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.loginUserRequest).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.userData).toEqual(mockUser);
    });
  });

  describe('Обновление профиля пользователя', () => {
    const mockActions = {
      pending: {
        type: updateUser.pending.type,
        payload: undefined
      },
      rejected: {
        type: updateUser.rejected.type,
        error: { message: 'Ошибка обновления профиля' }
      },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('Инициализация обновления профиля', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.request).toBe(true);
      expect(updatedState.error).toBeNull();
    });

    test('Обработка ошибки обновления', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
    });

    test('Успешное обновление профиля', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.response).toEqual(mockUser);
    });
  });

  describe('Процесс выхода из системы', () => {
    const mockActions = {
      pending: {
        type: logoutUser.pending.type,
        payload: undefined
      },
      rejected: {
        type: logoutUser.rejected.type,
        error: { message: 'Ошибка выхода из системы' }
      },
      fulfilled: {
        type: logoutUser.fulfilled.type,
        payload: null
      }
    };

    test('Инициализация процесса выхода', () => {
      const updatedState = userSlice(initialState, mockActions.pending);

      expect(updatedState.request).toBe(true);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.error).toBeNull();
    });

    test('Обработка ошибки выхода', () => {
      const updatedState = userSlice(initialState, mockActions.rejected);

      expect(updatedState.isAuthChecked).toBe(false);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBe(mockActions.rejected.error.message);
    });

    test('Успешный выход из системы', () => {
      const updatedState = userSlice(initialState, mockActions.fulfilled);

      expect(updatedState.isAuthChecked).toBe(false);
      expect(updatedState.isAuthenticated).toBe(false);
      expect(updatedState.request).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.userData).toBeNull();
    });
  });
});
