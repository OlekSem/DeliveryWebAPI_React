import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const RequireAdmin = ({children}) => {
	const user = useSelector(redux => redux.auth.user);
	if (!user) return <Navigate to="/login"/>;
	if (!user.roles?.includes("Admin")) return <Navigate to="/"/>;
	return children
}

export default RequireAdmin;