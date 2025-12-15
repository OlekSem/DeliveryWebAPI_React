import PublicHeader from "../components/PublicHeader.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../pages/Home.jsx";
import Edit from "../pages/Edit.jsx";
import CitiesPage from "../pages/CitiesPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import UserProfilePage from "../pages/UserProfilePage.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import {useSelector} from "react-redux";
import {Layout} from "antd";
import MainLayout from "../layouts/MainLayout.jsx";

const {Header, Content} = Layout;

const AppRoutes = () => {
	const user = useSelector(redux => redux.auth.user);
	return (
			<Routes>
				<Route element={<MainLayout/>}>
				<Route path="/" element={<Home/>}/>
				<Route path="/edit/:id" element={<Edit/>}/>
				<Route path="/cities" element={<CitiesPage/>}/>
				{user == null ?
					<>
						<Route path="/login" element={<LoginPage/>}/>
						<Route path="/register" element={<RegisterPage/>}/>
					</>: <Route path="/profile" element={<UserProfilePage/>}/>}
				</Route>
				{AdminRoutes}
			</Routes>)
}

export default AppRoutes;