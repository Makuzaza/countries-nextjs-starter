import { createSlice } from "@reduxjs/toolkit";

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  reducers: {
    addFavourite(state, action) {
      if (
        state.favourites.some(
          (favourite) => favourite.name.common === action.payload.name.common
        )
      )
        return;
      state.favourites = [...state.favourites, action.payload];
    },
    removeFromFavourites(state, action) {
      const countryName = action.payload;
      state.favourites = state.favourites.filter(
        (favourite) => favourite.name.common !== countryName
      );
    },
    clearFavourites(state, action) {
      state.favourites = [];
    },
  },
});

export const { addFavourite, removeFromFavourites, clearFavourites } = favouritesSlice.actions;

export default favouritesSlice.reducer;
