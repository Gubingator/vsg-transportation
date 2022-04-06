import { createSlice, createAction } from "@reduxjs/toolkit";


/* Create the slice, which is part of the store for our applicaiton */
export const stemsSlice = createSlice({
  name: "carpools",
  initialState: {
    carpools: [],
  },
  reducers: {
    // add a new carpool to the store
    newCarpool: (state, action) => {
      return { ...state, carpools: [action.payload, ...state.carpools] };
    },
    // set the whole carpool store
    setCarpools: (state, action) => {
      return { ...state, carpools: [...action.payload] };
    },
    // delete a specific carpool
		deleteCarpool: (state, action) => {
			const Carpools_1 = state.carpools.filter((carpool) => {
				return carpool.id !== action.payload.id;
			});
      return { ...state, carpools: [...Carpools_1] };
    },
    // update a specific carpool
    updateCarpool: (state, action) => {
      const new_carpools = state.carpools.map((carpool) => {
        if (carpool.id === action.payload.id){
          return action.payload;
        } 
        return carpool;
      })
      return { ...state, carpools: [...new_carpools] };
    }
  },
});

export const { newCarpool, setCarpools, deleteCarpool, updateCarpool} = stemsSlice.actions;

export default stemsSlice.reducer;
