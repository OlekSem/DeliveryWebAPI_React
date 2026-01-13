import {Layout, Menu, Dropdown, Space, Avatar} from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";
import {logout} from "../services/authSlice";
import APP_ENV from "../env";
import CartComponent from "./CartComponent.tsx";

const {Header} = Layout;

const PublicHeader: React.FC = () => {
    const user = useAppSelector(state => state.auth.user);
    const isAdmin = user?.roles?.includes("Admin");
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userMenu = {
        items: [
            {
                key: "profile",
                label: <Link to="/profile">Profile</Link>
            },
            {
                key: "logout",
                icon: <LogoutOutlined/>,
                label: "Logout",
                onClick: () => {
                    dispatch(logout());
                    navigate("/");
                }
            }
        ]
    };

    const menuItems = [
        {key: "/", label: <Link to="/">Home</Link>},
        {key: "/countries", label: <Link to="/countries">Countries</Link>},
        {key: "/cities", label: <Link to="/cities">Cities</Link>},
        {key: "/transportations", label: <Link to="/transportations">Transportations</Link>},

        ...(user
            ? [
                ...(isAdmin
                    ? [{key: "/admin", label: <Link to="/admin">Admin Panel</Link>}]
                    : []),
                {key: "/profile", label: <Link to="/profile">Profile</Link>}
            ]
            : [
                {key: "/login", label: <Link to="/signin">Sign In</Link>},
                {key: "/register", label: <Link to="/signup">Sign Up</Link>}
            ])
    ]
    return (
        <Header
            className="bg-white dark:bg-[#141414]text-gray-900 dark:text-gray-100 "
            style={{
                display: "flex",
                alignItems: "center",
                paddingInline: 24,
                height: 70
            }}
        >
            {/* LEFT MENU */}
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems.map(item => ({
                    ...item,
                    style: {
                        paddingInline: 16,
                        height: 70,
                        display: "flex",
                        alignItems: "center"
                    }
                }))}
                className={"rounded-2xl"}
                style={{flex: 1, borderBottom: "none"}}
            />

            {/* RIGHT USER */}
            {user && (
                <>
                    <Dropdown menu={userMenu} trigger={["click"]}>
                        <Space style={{cursor: "pointer"}}>
                            <Avatar
                                size="large"
                                src={
                                    user.image
                                        ? `${APP_ENV.API_BASE_URL}/images/${user.image}`
                                        : undefined
                                }
                                icon={!user.image && <UserOutlined/>}
                            />
                            <span style={{fontWeight: 500}}>{user.name}</span>
                        </Space>
                    </Dropdown>
                    <CartComponent/>
                </>
            )}
        </Header>
    );
};

export default PublicHeader;