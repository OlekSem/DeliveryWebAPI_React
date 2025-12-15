import {Route} from "react-router-dom";
import RequireAdmin from "../components/RequireAdmin.jsx";
import Countries from "../components/Countries.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import CreateCountry from "../pages/CreateCountry.jsx";
import CreateCity from "../pages/CreateCity.jsx";
import CitiesPage from "../pages/CitiesPage.jsx";

const AdminRoutes = (
		<Route path="/admin"
			   element={<RequireAdmin>
					<AdminLayout/>
			   </RequireAdmin>}>
			<Route path="countries" element={<Countries />} />
			<Route path="cities" element={<CitiesPage />} />
			<Route path="create/country" element={<CreateCountry/>}/>
			<Route path="create/city" element={<CreateCity/>}/>
		</Route>
	)
export default AdminRoutes;