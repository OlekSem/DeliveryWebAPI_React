import {createSlice} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const getUserFromToken = (token) => {
	try {
		const decode = jwtDecode(token);
		return decode ?? null;
	}
	catch (err) {
		console.error("Invalid token", err);
		return null;
	}
}

const token = localStorage.token;
const user = getUserFromToken(token);

const initialState = {
	user: user
}

const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		loginSuccess: (state, action) => {
			const authToken = action.payload;
			const user = getUserFromToken(authToken);
			if (user) {
				state.user = user;
				localStorage.token = authToken;
			}
		},
		logout: (state) => {
			state.user = null;
			localStorage.removeItem('token');
		},
	}
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;