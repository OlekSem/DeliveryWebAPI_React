import {Layout} from "antd";
import AdminSidebar from "../admin/components/AdminSidebar.jsx";
import {Outlet} from "react-router-dom";
import AdminHeader from "../admin/components/AdminHeader.jsx";

const {Sider, Content, Header} = Layout

const AdminLayout = () => (
	<Layout style={{minHeight: '100vh'}}>
		<AdminHeader/>
		<Layout>
			<Sider style={{width: 240}}
				   theme='light'
			>
				<AdminSidebar/>
			</Sider>
			<Layout>
				<Content style={{padding: 24}}>
					<Outlet/>
				</Content>
			</Layout>
		</Layout>
	</Layout>
)

export default AdminLayout;