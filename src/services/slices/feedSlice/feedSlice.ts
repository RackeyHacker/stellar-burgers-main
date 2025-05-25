import { getFeedsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feeds/all', async () => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    throw new Error('Failed to fetch order feed');
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeedErrors: (state) => {
      state.error = null;
    },
    resetFeedState: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
    }
  },
  selectors: {
    getFeedState: (state) => state,
    getOrdersCount: (state) => ({
      total: state.total,
      today: state.totalToday
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load order feed';
      });
  }
});

export const { clearFeedErrors, resetFeedState } = feedSlice.actions;
export const { getFeedState, getOrdersCount } = feedSlice.selectors;

export default feedSlice.reducer;
