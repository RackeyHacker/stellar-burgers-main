import { getOrderByNumberApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderByNumberResponse: TOrder | null;
  request: boolean;
  responseOrder: null;
  error: string | null;
};

export const initialState: TOrderState = {
  orders: [],
  orderByNumberResponse: null,
  request: false,
  responseOrder: null,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (orderNumber: number) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch order #${orderNumber}`);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderState: (state) => {
      state.orderByNumberResponse = null;
      state.error = null;
      state.request = false;
    }
  },
  selectors: {
    getOrderState: (state) => state,
    getOrderDetails: (state) => state.orderByNumberResponse,
    getOrderLoadingState: (state) => ({
      isLoading: state.request,
      error: state.error
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        state.orderByNumberResponse = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load order details';
        state.request = false;
      });
  }
});

export const { clearOrderError, resetOrderState } = orderSlice.actions;
export const { getOrderState, getOrderDetails, getOrderLoadingState } =
  orderSlice.selectors;

export default orderSlice.reducer;
