import {
  registerUser,
  loginUser,
  updateUser,
  logOutUser,
  userReducer,
  authChecked,
  setUser,
  userLogout
} from '../userSlice';
import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@api');
jest.mock('@cookie');

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: -1,
  key: jest.fn()
};

global.localStorage = localStorageMock;

afterAll(() => {
  jest.clearAllMocks();
});

const mockUser = {
  email: 'fitopisya@yandex.ru',
  name: 'Daniele'
};

const mockValue = {
  success: true,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: mockUser
};

describe('userSlice', () => {
  describe('registerUser', () => {
    test('registerUser.fulfilled устанавливает data', async () => {
      (api.registerUserApi as jest.Mock).mockResolvedValue(mockValue);
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(registerUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.data).toEqual(mockUser);
      expect(state.registerUserRequest).toBe(false);
      expect(state.registerUserError).toBeNull();
      expect(state.isAuth).toBe(true);
      expect(state.authStatus).toBe(true);
    });

    test('registerUser.pending устанавливает registerUserRequest', () => {
      const store = configureStore({ reducer: { userReducer } });
      store.dispatch(registerUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.registerUserRequest).toBe(true);
      expect(state.registerUserError).toBeNull();
    });

    test('registerUser.rejected устанавливает registerUserError', async () => {
      (api.registerUserApi as jest.Mock).mockResolvedValue({ success: false });
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(registerUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.registerUserError).toBe('Ошибка регистрации пользователя');
      expect(state.registerUserRequest).toBe(false);
    });
  });

  describe('loginUser', () => {
    test('loginUser.pending устанавливает loginUserRequest', () => {
      const store = configureStore({ reducer: { userReducer } });
      store.dispatch(loginUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.loginUserRequest).toEqual(true);
      expect(state.loginUserError).toBeNull();
    });

    test('loginUser.fulfilled устанавливает data', async () => {
      (api.loginUserApi as jest.Mock).mockResolvedValue(mockValue);
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(loginUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.data).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.authStatus).toBe(true);
    });

    test('loginUser.rejected устанавливает loginUserError', async () => {
      (api.loginUserApi as jest.Mock).mockResolvedValue({ success: false });
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(loginUser({ ...mockUser, password: '12345' }));
      const state = store.getState().userReducer;
      expect(state.data).toBeNull();
      expect(state.loginUserError).toEqual('Ошибка входа в аккаунт');
    });
  });

  describe('updateUser', () => {
    test('updateUser.fulfilled устанавливает data', async () => {
      (api.updateUserApi as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser
      });
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(updateUser({ name: mockUser.name }));
      const state = store.getState().userReducer;
      expect(state.data).toEqual(mockUser);
      expect(state.updateUserRequest).toBe(false);
      expect(state.updateUserError).toBeNull();
    });

    test('updateUser.rejected устанавливает updateUserError', async () => {
      (api.updateUserApi as jest.Mock).mockResolvedValue({ success: false });
      const store = configureStore({ reducer: { userReducer } });
      await store.dispatch(updateUser({ name: mockUser.name }));
      const state = store.getState().userReducer;
      expect(state.data).toBeNull();
      expect(state.updateUserRequest).toBe(false);
      expect(state.updateUserError).toBe(
        'Ошибка обновления данных пользователя'
      );
    });

    test('updateUser.pending устанавливает запрос true и очищает ошибку', () => {
      const store = configureStore({ reducer: { userReducer } });
      store.dispatch(updateUser({ name: mockUser.name }));
      const state = store.getState().userReducer;
      expect(state.data).toBeNull();
      expect(state.updateUserRequest).toBe(true);
      expect(state.updateUserError).toBeNull();
    });
  });

  test('logOutUser выход из личного кабинета', async () => {
    const store = configureStore({ reducer: { userReducer } });
    store.dispatch(loginUser({ ...mockUser, password: '12345' }));
    const state = store.getState().userReducer;
    expect(state.loginUserRequest).toEqual(true);
    expect(state.loginUserError).toBeNull();
    store.dispatch(logOutUser());
    expect(state.data).toBeNull();
    expect(state.authStatus).toBe(false);
  });

  test('authChecked аутентификация пользователя', () => {
    const store = configureStore({ reducer: { userReducer } });
    store.dispatch(authChecked());
    const state = store.getState().userReducer;
    expect(state.isAuth).toBe(true);
  });

  test('setUser устанавливает данные пользователя', () => {
    const store = configureStore({ reducer: { userReducer } });
    store.dispatch(setUser(mockUser));
    const state = store.getState().userReducer;
    expect(state.data).toEqual(mockUser);
    expect(state.authStatus).toBe(true);
  });

  test('userLogout очищает данные и authStatus', () => {
    (api.loginUserApi as jest.Mock).mockResolvedValue({
      success: true,
      user: mockUser
    });
    const store = configureStore({ reducer: { userReducer } });
    store.dispatch(loginUser({ ...mockUser, password: '12345' }));
    const state = store.getState().userReducer;
    expect(state.loginUserRequest).toEqual(true);
    expect(state.loginUserError).toBeNull();
    store.dispatch(userLogout());
    expect(state.data).toBeNull();
    expect(state.authStatus).toBe(false);
  });
});
