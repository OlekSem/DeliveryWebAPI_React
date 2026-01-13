import Header from "./components/PublicHeader.tsx";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {useAppSelector} from "./store";
import Home from "./admin/pages/Dashboard/Home.tsx";
import {Home as PublicHome} from "./pages/Home.tsx";
import AppLayout from "./admin/layout/AppLayout.tsx";
import UserProfiles from "./admin/pages/UserProfiles.tsx";
import Blank from "./admin/pages/Blank.tsx";
import FormElements from "./admin/pages/Forms/FormElements.tsx";
import BasicTables from "./admin/pages/Tables/BasicTables.tsx";
import Alerts from "./admin/pages/UiElements/Alerts.tsx";
import Avatars from "./admin/pages/UiElements/Avatars.tsx";
import Badges from "./admin/pages/UiElements/Badges.tsx";
import Buttons from "./admin/pages/UiElements/Buttons.tsx";
import Images from "./admin/pages/UiElements/Images.tsx";
import Videos from "./admin/pages/UiElements/Videos.tsx";
import LineChart from "./admin/pages/Charts/LineChart.tsx";
import BarChart from "./admin/pages/Charts/BarChart.tsx";
import SignIn from "./admin/pages/AuthPages/SignIn.tsx";
import SignUp from "./admin/pages/AuthPages/SignUp.tsx";
import NotFound from "./admin/pages/OtherPage/NotFound.tsx";
import Calendar from "./admin/pages/Calendar.tsx";
import Countries from "./pages/Countries.tsx";
import Cities from "./pages/Cities.tsx";
import CreateCountry from "./pages/CreateCountry.tsx";
import CreateCity from "./pages/CreateCity.tsx";
import RequireAdmin from "./guards/RequireAdmin.tsx";
import ResetPassword from "./pages/users/ResetPassword.tsx";
import ForgotPassword from "./pages/users/ForgotPassword.tsx";
import Users from "./pages/users/Users.tsx";
import RequireAuthentification from "./guards/RequireAuthentification.tsx";
import Transportations from "./pages/Transportations.tsx";

const MainLayout : React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header/>
            <main className="p-6">
                <Outlet/>
            </main>
        </div>
    );
}
export default function App() {
    const user =
        useAppSelector(redux => redux.auth.user);

    console.log("User roles", user?.roles);
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<MainLayout/>}>
                    <Route index element={<PublicHome/>}/>
                    <Route path={"countries"} element={<Countries/>}/>
                    <Route path={"cities"} element={<Cities/>}/>
                    <Route path="profile" element={<UserProfiles/>}/>
                    <Route path={"transportations"} element={<Transportations/>}/>
                </Route>
                {/*<ScrollToTop />*/}
                {/*<Routes>*/}
                {/* Dashboard Layout */}
                <Route
                    path={'/admin'}
                    element={<RequireAdmin><AppLayout/></RequireAdmin>}>
                    <Route index element={<Home/>}/>

                    {/* Create */}
                    <Route
                        path={'create'}>
                        <Route path={"country"} element={<CreateCountry/>}/>
                        <Route path={"city"} element={<CreateCity/>}/>
                    </Route>

                    {/* View Data */}
                    <Route path={"users"} element={<Users/>}/>
                    <Route path={"countries"} element={<Countries/>}/>
                    <Route path={"cities"} element={<Cities/>}/>

                    {/* Others Page */}
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="blank" element={<Blank/>}/>
                    <Route path="profile" element={<UserProfiles/>}/>

                    {/* Forms */}
                    <Route path="form-elements" element={<FormElements/>}/>

                    {/* Tables */}
                    <Route path="basic-tables" element={<BasicTables/>}/>

                    {/* Ui Elements */}
                    <Route path="alerts" element={<Alerts/>}/>
                    <Route path="avatars" element={<Avatars/>}/>
                    <Route path="badge" element={<Badges/>}/>
                    <Route path="buttons" element={<Buttons/>}/>
                    <Route path="images" element={<Images/>}/>
                    <Route path="videos" element={<Videos/>}/>

                    {/* Charts */}
                    <Route path="line-chart" element={<LineChart/>}/>
                    <Route path="bar-chart" element={<BarChart/>}/>
                </Route>

                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path={"/forgotPassword"} element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword />} />


                {/* Fallback Route */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            {/*</Router>*/}
        </BrowserRouter>
    )
        ;
};

