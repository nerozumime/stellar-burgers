import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserState } from '@utils-types';
import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';

const initialState: IUserState = {
  isAuth: false,
  authStatus: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(userData);

    if (!response?.success) {
      return rejectWithValue('Ошибка регистрации пользователя');
    }

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi({ email, password });

    if (!data?.success) {
      return rejectWithValue('Ошибка входа в аккаунт');
    }

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async function (_, { dispatch }) {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        if (response.success) {
          dispatch(setUser(response.user));
        }
      } catch (e) {
        console.log(`Ошибка: ${e}`);
      }
    }
    dispatch(authChecked());
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async function (userData: Partial<TRegisterData>, { rejectWithValue }) {
    const response = await updateUserApi(userData);
    return response?.success
      ? response.user
      : rejectWithValue('Ошибка обновления данных пользователя');
  }
);

export const logOutUser = createAsyncThunk(
  'user/logOutUser',
  async function (_, { dispatch }) {
    try {
      await logoutApi();
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    } catch (e) {
      console.log(`Ошибка выхода: ${e}`);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuth = true;
    },
    setUser: (state, action) => {
      state.data = action.payload;
      state.authStatus = true;
    },
    userLogout: (state) => {
      state.data = null;
      state.authStatus = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = null;
        state.data = action.payload;
        state.authStatus = true;
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = null;
        state.data = action.payload;
        state.authStatus = true;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload as string;
        state.isAuth = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = null;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload as string;
      });
  }
});

export const { authChecked, setUser, userLogout } = userSlice.actions;
export const userReducer = userSlice.reducer;
