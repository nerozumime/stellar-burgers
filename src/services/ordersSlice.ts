import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { IOrderState, TOrder } from '@utils-types';
import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

const initialState: IOrderState = {
  currentOrder: null,
  orderModalData: null,
  ordersHistory: [],
  orderRequest: false,
  ordersHistoryRequest: false,
  orderError: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const orderData = await orderBurgerApi(ingredients);
      return orderData.order;
    } catch (_) {
      return rejectWithValue('Ошибка создания заказа');
    }
  }
);

export const fetchOrderNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const orderData = await getOrderByNumberApi(orderNumber);
      return orderData.orders[0];
    } catch (_) {
      return rejectWithValue('Ошибка получения номера заказа');
    }
  }
);

export const fetchOrdersHistory = createAsyncThunk(
  'order/fetchOrdersHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (_) {
      return rejectWithValue('Ошибка получения истории заказов');
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload as TOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })

      .addCase(fetchOrderNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(fetchOrderNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })

      .addCase(fetchOrdersHistory.pending, (state) => {
        state.ordersHistoryRequest = true;
        state.orderError = null;
      })
      .addCase(fetchOrdersHistory.fulfilled, (state, action) => {
        state.ordersHistoryRequest = false;
        state.ordersHistory = action.payload;
      })
      .addCase(fetchOrdersHistory.rejected, (state, action) => {
        state.ordersHistoryRequest = false;
        state.orderError = action.payload as string;
      });
  }
});

export const selectOrderByNumber = createSelector(
  [
    (state: RootState) => state.orderReducer.ordersHistory,
    (state: RootState) => state.feedReducer.orders,
    (state: RootState) => state.orderReducer.currentOrder,
    (_, orderNumber: string | undefined) => orderNumber
  ],
  (ordersHistory, feedOrders, currentOrder, orderNumber) => {
    if (!orderNumber) return null;

    const orderNum = Number(orderNumber);

    return (
      ordersHistory?.find((order) => order.number === orderNum) ||
      feedOrders?.find((order) => order.number === orderNum) ||
      (currentOrder?.number === orderNum ? currentOrder : null) ||
      null
    );
  }
);
export const { clearOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
