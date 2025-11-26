import './App.css'
import {Layout} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HeaderNav from "./Components/HeaderNav.jsx";
import Create from "./Pages/Create.jsx";
import Home from "./Pages/Home.jsx";
import Edit from "./Pages/Edit.jsx";

const {Header, Content} = Layout;

function App() {
	return (
		<BrowserRouter>
			<HeaderNav/>
			<Content style={{ padding: '0 48px' }}>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/create" element={<Create/>}/>
					<Route path="/edit/:id" element={<Edit/>}/>
				</Routes>
			</Content>
		</BrowserRouter>
	)
}

export default App