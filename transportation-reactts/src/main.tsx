import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {Provider} from "react-redux";
import {setupStore} from "./store";
import {ThemeProvider} from "./admin/context/ThemeContext.tsx";
import {AppWrapper} from "./admin/components/common/PageMeta.tsx";
import App from "./App.tsx";
import AntDThemeProvider from "./theme/AntDThemeProvider.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

// const queryClient = new QueryClient();
const store = setupStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <AntDThemeProvider>
                <AppWrapper>
                    <Provider store={store}>
                        <GoogleOAuthProvider clientId={'793946857005-lvi5cf13sa1a0fuiuv7sunhu7a9jbr4j.apps.googleusercontent.com'}>
                            <App/>
                        </GoogleOAuthProvider>
                        {/*<QueryClientProvider client={queryClient}>*/}
                        {/*    <App/>*/}
                        {/*    /!*<RouterProvider router={router}/>*!/*/}
                        {/*</QueryClientProvider>*/}
                    </Provider>
                </AppWrapper>
            </AntDThemeProvider>
        </ThemeProvider>
    </React.StrictMode>
);