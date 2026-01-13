import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import {useAppDispatch} from "../../../store";
import {loginSuccess} from "../../../services/authSlice.ts";
import APP_ENV from "../../../env";
import type {Login} from "../../../Interfaces/User/Login.ts";
import axios from "axios";
import type {LoginSuccess} from "../../../Interfaces/User/LoginSuccess.ts";
import {useGoogleLogin} from "@react-oauth/google";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loginUseGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("tokenResponse", tokenResponse.access_token);
            //console.log("tokenResponse", tokenResponse);
            try {
                const response =
                    await axios.post<LoginSuccess>(`${APP_ENV.API_BASE_URL}/api/Account/googleLogin`, {
                        idToken: tokenResponse.access_token
                    });
                // dispatch(loginSuccess(result.token));
                const {token} = response.data;
                dispatch(loginSuccess(token));
                navigate("/");
                console.log("Google користувач:", response.data);
            } catch (error) {
                console.error("Google логін не вдалий:", error);
            }
        },
    });

    const onFinish = async (e) => {
        e.preventDefault();
        console.log('Success:', email, " - ", password);
        console.log(JSON.stringify({email, password}));


        const model: Login = {
            email,
            password
        };
        try {
            const res = await axios.post<LoginSuccess>(
                APP_ENV.API_BASE_URL + "/api/Account/login",
                model,
            );
            const {token} = res.data;
            dispatch(loginSuccess(token));
            navigate("/profile");
        } catch (err) {
            console.error("Error:", err);
            alert("Log in failed");
        }
        // const onFinishFailed = errorInfo => {
        //     console.log('Failed:', errorInfo);
        // };
    }
    return (
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5"/>
                    Back to dashboard
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign In
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign in!
                        </p>
                    </div>
                    <div>

                        <form
                            onSubmit={onFinish}
                        >
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        value={email}
                                        onChange={(event) => (setEmail(event.target.value))}
                                        placeholder="info@gmail.com"/>
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={password}
                                            onChange={(event) => (setPassword(event.target.value))}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                      {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      )}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">

                                    {/*    /!*<Link*!/*/}
                                    {/*    /!*    to="/reset-password"*!/*/}
                                    {/*    /!*    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"*!/*/}
                                    {/*    /!*>*!/*/}
                                    {/*    /!*    Forgot password?*!/*/}
                                    {/*    /!*</Link>*!/*/}
                                    <Link
                                        to="/forgotPassword"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div>
                                    <Button className="w-full " size="sm">
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                loginUseGoogle();
                            }}
                            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-2 rounded w-full mt-4"
                        >
                            {'LoginGoogle'}
                        </button>
                            <div className="mt-5">
                                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                    Don&apos;t have an account? {""}
                                    <Link
                                        to="/signup"
                                        className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                    </div>
                </div>
            </div>
        </div>
);
}
