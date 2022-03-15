import { createSlice, createAction } from "@reduxjs/toolkit";

export const stemsSlice = createSlice({
  name: "carpools",
  initialState: {
    carpools: [],
  },
  reducers: {
    newCarpool: (state, action) => {
      return { ...state, carpools: [action.payload, ...state.carpools] };
    },
    setCarpools: (state, action) => {
      return { ...state, carpools: [...action.payload] };
    },
		deleteCarpool: (state, action) => {
			const Carpools_1 = state.carpools.filter((carpool) => {
				return carpool.id !== action.payload.id;
			});
      return { ...state, carpools: [...Carpools_1] };
    },
  },
});

export const { newCarpool, setCarpools, deleteCarpool } = stemsSlice.actions;

export default stemsSlice.reducer;
