import {Avatar, Dropdown, Layout, Menu, Space} from "antd";
import {Link, useNavigate} from "react-router-dom";
import APP_ENV from "../../env/index.js";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../services/authSlice.js";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";

const {Header} = Layout;


const AdminHeader = () => {
	const user = useSelector(r => r.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userMenu = {
		items: [
			{
				key: "profile",
				label: <Link to="/profile">Profile</Link>
			},
			{
				key: "logout",
				label: "Logout",
				icon: <LogoutOutlined/>,
				onClick: () => {
					dispatch(logout());
					navigate("/");
				}
			}
		]
	};

	return (<Header

			style={{
				background: "#fff",
				position: "sticky",
				top: 0,
				zIndex: 1,
				width: "100%",
				display: "flex",
				alignItems: "center",
				paddingInline: 24
			}}
		>
			{/*{*/}
			{/*	user != null && (<div className={"flex justify-end gap-4"}>*/}
			{/*			<Link to="/user/Profile" className="hover:underline flex items-center h-full">*/}
			{/*				<div className="flex items-center justify-end gap-4">*/}

			{/*					<img src={`${APP_ENV.API_BASE_URL}/images/${user ? user.image : "default.png"}`} alt="logo"*/}
			{/*						 className={"rounded-full w-8 h-8"}/>*/}

			{/*					<h1 className={"text-xl"}>{`${user?.name}`}</h1>*/}
			{/*				</div>*/}
			{/*			</Link>*/}

			{/*			<span onClick={() => {*/}
			{/*				dispatch(logout());*/}
			{/*				navigate("/");*/}
			{/*			}} className="px-6 py-2 cursor-pointer">Вийти</span>*/}
			{/*		</div>)*/}

			{/*}*/}

			<Menu
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
					{key: "/", label: <Link to="/">Back to Public site</Link>},

				]}
			/>
			{user
				&& <Dropdown menu={userMenu} trigger="click">
					<Space style={{cursor: "pointer"}}>
						<Avatar
							style={{backgroundColor: "#1677ff"}}
							size="large"
							src={user.image ? `${APP_ENV.API_BASE_URL}/images/${user.image}` : undefined}
							icon={!user.image && <UserOutlined/>}
						/>
						<span style={{fontWeight: 500, color: "#000"}}>
							{user.name}
						</span>
					</Space>
				</Dropdown>
			}
		</Header>
	)
}
export default AdminHeader;