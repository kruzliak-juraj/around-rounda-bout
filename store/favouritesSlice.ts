import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface FavouritesState {
  favourites: string[] | undefined;
}

const initialState: FavouritesState = {
  favourites: undefined,
};

export const counterSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<string[]>) => {
      state.favourites = action.payload;
    },
  },
});

export const { setFavourites } = counterSlice.actions;

export const getFavourites = (state: RootState) => state.favourites;

export default counterSlice.reducer;
