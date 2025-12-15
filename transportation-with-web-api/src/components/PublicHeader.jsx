import {Menu, Layout} from "antd";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const {Header} = Layout;

const PublicHeader = () => {
	const user = useSelector(redux => redux.auth.user);
	const isAdmin = user?.roles?.includes("Admin");
	const location = useLocation();

	return (
		<Header
			style={{
				display: 'flex',
				alignItems: 'center',
				height: 70,
				paddingInline: 0
			}}
		>
			<Menu
				theme="light"
				mode="horizontal"
				selectedKeys={[location.pathname]}
				style={{
					flex: 1,
					minWidth: 0,
					height: '100%',
					fontSize: 16,
					display: 'flex',
					alignItems: 'center'
				}}
				items={[
					{key: "/", label: <Link to="/">Countries</Link>},
					{key: "/cities", label: <Link to="/cities">Cities</Link>},
					...(user == null
							? [
								{key: "/login", label: <Link to="/login">Login</Link>},
								{key: "/register", label: <Link to="/register">Register</Link>}]
							: [
								...(isAdmin
									? [{key: "/admin", label: <Link to="/admin/">Admin Panel</Link>}]
									: []),
								{key: "/profile", label: <Link to="/profile">Profile</Link>}
							]
					),
				]}
			/>
		</Header>
	)
}

export default PublicHeader;