import { configureStore } from "@reduxjs/toolkit";

import carpoolsSlice from "./carpoolsSlice";

export default configureStore({
	reducer: {
		carpoolsSlice: carpoolsSlice,
	}
})