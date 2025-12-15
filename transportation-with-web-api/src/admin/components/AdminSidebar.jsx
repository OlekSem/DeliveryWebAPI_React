import {Link, useLocation} from "react-router-dom";
import {Menu} from "antd";

const AdminSidebar = () => {
	const location = useLocation();

	return(
		<Menu
			theme="light"
			mode="inline"
			selectedKeys={[location.pathname]}
			items={[
				// {
				// 	key: "/admin",
				// 	label: <Link to="/admin">Dashboard</Link>
				// },
				{
					key: "management",
					label: "Management",
					children: [
						{ key: "/admin/users", label: <Link to="/admin/users">Users</Link> },
						{ key: "/admin/countries", label: <Link to="/admin/countries">Countries</Link> },
						{ key: "/admin/cities", label: <Link to="/admin/cities">Cities</Link> },
						{ key: "/admin/create/country", label: <Link to="/admin/create/country">Create country</Link> },
						{ key: "/admin/create/city", label: <Link to="/admin/create/city">Create city</Link> },
						// { key: "/admin/transportations", label: <Link to="/admin/transportations">Transport</Link> }
					]
				}
			]}
		>

		</Menu>
	)
}

export default AdminSidebar;