import {Layout} from "antd";
import PublicHeader from "../components/PublicHeader.jsx";
import {Outlet} from "react-router-dom";

const {Header} = Layout;

const MainLayout = () => {
	return(
		<Layout>
			<PublicHeader/>
			<main className={"p-6 h-full"}>
				<Outlet/>
			</main>
		</Layout>
	)
}

export default MainLayout;