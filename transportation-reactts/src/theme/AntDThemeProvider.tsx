import {useTheme} from "../admin/context/ThemeContext.tsx";
import {ConfigProvider} from "antd";
import {darkTheme, lightTheme} from "./antdScheme.tsx";

const AntDThemeProvider : React.FC<{ children : React.ReactNode }> = ({children}) => {
    const { theme } = useTheme();

    return(
        <ConfigProvider theme={ theme === "dark" ? darkTheme : lightTheme }>
            {children}
        </ConfigProvider>
    )
}

export default AntDThemeProvider;