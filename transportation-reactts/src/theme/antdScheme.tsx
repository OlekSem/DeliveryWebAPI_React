// import type { ThemeConfig } from "antd";
//
// export const lightTheme: ThemeConfig = {
//     token: {
//         colorBgContainer: "#ffffff",
//         colorText: "#111827",
//         borderRadiusLG: 12,
//     },
//     components: {
//         Card: {
//             colorBgContainer: "#ffffff",
//             colorBorderSecondary: "#e5e7eb",
//             boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//             paddingLG: 20,
//         },
//     },
// };
//
// export const darkTheme: ThemeConfig = {
//     token: {
//         colorBgContainer: "#111827",
//         colorText: "#e5e7eb",
//         borderRadiusLG: 12,
//     },
//     components: {
//         Card: {
//             colorBgContainer: "#1f2937",
//             colorBorderSecondary: "#374151",
//             boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
//             paddingLG: 20,
//         },
//     },
// };
import { theme } from "antd";

export const lightTheme = {
    algorithm: theme.defaultAlgorithm,
};

export const darkTheme = {
    algorithm: theme.darkAlgorithm,
};