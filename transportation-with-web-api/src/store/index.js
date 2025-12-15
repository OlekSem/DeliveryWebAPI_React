import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {useDispatch, useSelector} from "react-redux";
import authReducer from "../services/authSlice.js";

const rootReducer = combineReducers({
	auth: authReducer
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
			),

	});
};