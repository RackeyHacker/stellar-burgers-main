import { getIngredientsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk('ingredient/get', async () => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    throw new Error('Failed to load ingredients');
  }
});

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    resetIngredients: (state) => {
      state.ingredients = [];
      state.error = null;
    }
  },
  selectors: {
    getIngredientState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error occurred';
      });
  }
});

export const { resetIngredients } = ingredientSlice.actions;
export const { getIngredientState } = ingredientSlice.selectors;

export default ingredientSlice.reducer;
