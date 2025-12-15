import {GoogleLogin} from "@react-oauth/google";
import APP_ENV from "../env/index.js";

const GoogleLoginComponent = () => {
	return(
		<>
			<GoogleLogin
				onSuccess={async (credentialResponse) => {
					console.log(credentialResponse.credential);
					const res = await fetch(`${APP_ENV.API_BASE_URL}/api/Auth/google-login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ token: credentialResponse.credential })
					});
					const data = await res.json();

					localStorage.setItem("token", data.jwt);

					console.log("Logged in with own JWT:", data.jwt);
				}}
				onError={() => console.log('login failed')}
			/>
		</>
	)
}
export default GoogleLoginComponent;