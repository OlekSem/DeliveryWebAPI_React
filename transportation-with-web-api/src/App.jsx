import './App.css'
import {Layout} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HeaderNav from "./Components/HeaderNav.jsx";
import Create from "./Pages/Create.jsx";
import Home from "./Pages/Home.jsx";
import Edit from "./Pages/Edit.jsx";
import CreateCity from "./Pages/CreateCity.jsx";
import CitiesPage from "./Pages/CitiesPage.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";

const {Header, Content} = Layout;

function App() {
	return (
		<GoogleOAuthProvider clientId={'793946857005-lvi5cf13sa1a0fuiuv7sunhu7a9jbr4j.apps.googleusercontent.com'}>
			<BrowserRouter>
				<HeaderNav/>
				<Content style={{padding: '0 48px'}}>
					<Routes>
						<Route path="/" element={<Home/>}/>
						<Route path="/create/country" element={<Create/>}/>
						<Route path="/edit/:id" element={<Edit/>}/>
						<Route path="/cities" element={<CitiesPage/>}/>
						<Route path="/create/city" element={<CreateCity/>}/>
						<Route path="/login" element={<LoginPage/>}/>
						<Route path="/register" element={<RegisterPage/>}/>
					</Routes>
				</Content>
			</BrowserRouter>
		</GoogleOAuthProvider>
	)
}

export default App