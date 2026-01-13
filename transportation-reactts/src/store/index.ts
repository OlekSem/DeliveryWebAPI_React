import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import authReducer from "../services/authSlice.ts";

const rootReducer = combineReducers({
    auth: authReducer
    });

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                // countryApi.middleware,
                // cityApi.middleware,
                // googleApi.middleware,
                // authApi.middleware,
                // authorizedUserApi.middleware
            ),

    });
};


export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector