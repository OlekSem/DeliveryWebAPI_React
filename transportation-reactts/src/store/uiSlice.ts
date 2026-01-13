// import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
//
// export type ThemeMode = 'light' | 'dark';
//
// const getInitialScheme = (): ThemeMode => {
//     const saved = localStorage.getItem('theme');
//     return saved === 'dark' ? 'dark' : 'light';
// }
//
// const uiSlice = createSlice({
//     name: "ui",
//     initialState: {
//         theme: getInitialScheme(),
//     },
//     reducers: {
//         setTheme(state, action: PayloadAction<ThemeMode>) {
//             state.theme = action.payload;
//             localStorage.setItem("theme", action.payload);
//         },
//         toggleTheme(state){
//             state.theme = state.theme === "dark" ? "dark" : "light";
//             localStorage.setItem("theme", state.theme);
//         }
//     }
// })
//
// export const {setTheme, toggleTheme} = uiSlice.actions;
// export default uiSlice.reducer;