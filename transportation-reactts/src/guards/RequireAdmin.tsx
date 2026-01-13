import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const RequireAdmin = ({children}) => {
    const user = useSelector(redux => redux.auth.user);
    if (!user) return <Navigate to="/" replace/>;
    if (!user.roles?.includes("Admin")) return <Navigate to="/" replace/>;
    return children
}

export default RequireAdmin;