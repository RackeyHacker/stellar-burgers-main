import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import constructorReducer from './constructorSlice/constructorSlice';
import ingredientReducer from './ingredientSlice/ingredientSlice';
import orderReducer from './orderSlice/orderSlice';
import userReducer from './userSlice/userSlice';
import feedReducer from './feedSlice/feedSlice';

type RootState = {
    constructorBurger: ReturnType<typeof constructorReducer>;
    ingredient: ReturnType<typeof ingredientReducer>;
    order: ReturnType<typeof orderReducer>;
    user: ReturnType<typeof userReducer>;
    feed: ReturnType<typeof feedReducer>;
};

describe('Тестирование конфигурации Redux хранилища', () => {
    let store: EnhancedStore<RootState>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                constructorBurger: constructorReducer,
                ingredient: ingredientReducer,
                order: orderReducer,
                user: userReducer,
                feed: feedReducer
            }
        });
    });

    test('Инициализация хранилища с корректными редьюсерами', () => {
        const state = store.getState();

        expect(state).toHaveProperty('constructorBurger');
        expect(state).toHaveProperty('ingredient');
        expect(state).toHaveProperty('order');
        expect(state).toHaveProperty('user');
        expect(state).toHaveProperty('feed');
    });

    test('Проверка начального состояния редьюсеров', () => {
        const state = store.getState();

        expect(state.constructorBurger).toEqual({
            loading: false,
            constructorItems: {
                bun: null,
                ingredients: []
            },
            orderRequest: false,
            orderModalData: null,
            error: null
        });

        expect(state.ingredient).toEqual({
            ingredients: [],
            loading: false,
            error: null
        });

        expect(state.order).toEqual({
            orders: [],
            orderByNumberResponse: null,
            request: false,
            responseOrder: null,
            error: null
        });

        expect(state.user).toEqual({
            request: false,
            error: null,
            response: null,
            registerData: null,
            userData: null,
            isAuthChecked: false,
            isAuthenticated: false,
            loginUserRequest: false,
            userOrders: []
        });

        expect(state.feed).toEqual({
            orders: [],
            total: 0,
            totalToday: 0,
            loading: false,
            error: null
        });
    });

    test('Проверка типов данных в начальном состоянии', () => {
        const state = store.getState();

        expect(Array.isArray(state.constructorBurger.constructorItems.ingredients)).toBe(true);
        expect(typeof state.constructorBurger.error).toBe('object');

        expect(Array.isArray(state.ingredient.ingredients)).toBe(true);
        expect(typeof state.ingredient.loading).toBe('boolean');
        expect(typeof state.ingredient.error).toBe('object');

        expect(Array.isArray(state.order.orders)).toBe(true);
        expect(typeof state.order.request).toBe('boolean');
        expect(typeof state.order.error).toBe('object');

        expect(typeof state.user.request).toBe('boolean');
        expect(typeof state.user.isAuthChecked).toBe('boolean');
        expect(typeof state.user.isAuthenticated).toBe('boolean');
        expect(Array.isArray(state.user.userOrders)).toBe(true);

        expect(Array.isArray(state.feed.orders)).toBe(true);
        expect(typeof state.feed.total).toBe('number');
        expect(typeof state.feed.totalToday).toBe('number');
        expect(typeof state.feed.loading).toBe('boolean');
    });
}); 