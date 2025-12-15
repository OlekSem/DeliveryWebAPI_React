import './App.css'
import {Layout} from "antd";
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import PublicHeader from "./components/PublicHeader.jsx";

function App() {
	return (
		<BrowserRouter>
			{/*<PublicHeader/>*/}
			<AppRoutes/>
		</BrowserRouter>
	)
}

export default App